import React from 'react';
import './Wallet.css'
import GolemNodeSync from '../../utils/GolemNodeSync'
import ZSyncApi from '../../utils/ZSyncApi';
import CommonComponents from '../common/CommonComponents';

const DEFAULT_TOKEN: string = 'GLM'

type IProps = {
  addresses: string[]
}

type IState = {
  wallets: IWallet[]
}

type IWallet = {
  address: string,
  network: string,
  balance: number | null,
  token: string
}

class Wallet extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = { wallets: [] }
  }

  componentDidMount() {
    this._startFetch()
  }

  async _startFetch() {
    const walletPromise = this.props.addresses.map(async address => {
      const node = await GolemNodeSync.fetchNode(address)
      return node === null ? null : node.info.wallet.toString()
    });

    const rawWallets = await Promise.all(walletPromise)
    const walletAddresses = this.state.wallets.map(items => { return items.address })
    rawWallets.forEach(item => {
      if (item === null || walletAddresses.includes(item)) {
        return
      }
      walletAddresses.push(item)
    })

    const paymentPromise = walletAddresses.map(async address => {
      const balance = await ZSyncApi.getBalance('mainnet', address, DEFAULT_TOKEN)
      if (balance === null) {
        console.error('ZSync Data for ' + address + ' is unavailable')
      }
      return { address, balance, network: 'mainnet', token: DEFAULT_TOKEN }
    })

    const wallets = await Promise.all(paymentPromise)
    this.setState({ wallets })
  }

  render() {
    console.log(this.state.wallets)
    const listItems = this.state.wallets.map(wallet => {
      let balanceRend = 'unknown'
      if (wallet.balance !== null) {
        const balance = _formatBalance(wallet.balance)
        balanceRend = balance.toString() + ' ' + wallet.token
      }

      return [
        _shrinkWallet(wallet.address),
        balanceRend
      ]
    })

    const list = CommonComponents.list(listItems.length !== 0
      ? listItems
      : ['', ''])
    
    return (
      <div className="container-fluid wallet">
        <div className="row">
          <div className="col">
            <h3>Wallet</h3>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            {list}
          </div>
        </div>
      </div>
    )
  }
}

/** ETH Addresses are really long, need to shorten. */
function _shrinkWallet(ethAddr: string) {
  return [
    ethAddr.substring(0, 6),
    ethAddr.substring(ethAddr.length - 5, ethAddr.length)
  ].join('...')
}

/** Balances are really long, need to shorten. */
function _formatBalance(balance: number, decimals = 7) {
  const mod = Math.pow(10, decimals)
  let friendlyBalance = balance == null ?
    "unknown" :
    Math.floor(balance * mod) / mod

  if (typeof friendlyBalance !== 'string') {
    friendlyBalance = friendlyBalance.toString() + '...'
  }
  return friendlyBalance
}

export default Wallet;