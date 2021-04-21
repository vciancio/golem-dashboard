import React from 'react';
import './Wallet.css'
import GolemNodeSync from '../../utils/GolemNodeSync'
import ZSyncApi from '../../utils/ZSyncApi';
import CommonComponents from '../common/CommonComponents';
import PaymentFormat from '../../utils/PaymentFormat';
import { ProviderEarnings } from '../../models/GolemProvider';

const DEFAULT_TOKEN: string = 'GLM'

type IProps = {
  addresses: string[]
}

type IState = {
  wallets: IWallet[],
  nodeIncome: ProviderEarnings[]
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
    this.state = {
      wallets: [],
      nodeIncome: []
    }
  }

  componentDidMount() {
    this._startFetch()
  }

  async _startFetch() {
    const nodesPromise = this.props.addresses.map(async address => {
      return await GolemNodeSync.fetchNode(address)
    });

    const nodes = await Promise.all(nodesPromise)
    const nodeIncome: ProviderEarnings[] = []
    const rawWallets: string[] = [] 
    nodes.forEach((node) => {
      if(node !== null){
       rawWallets.push(node.info.wallet.toString()) 
       if(node.stats.earnings != null){
         nodeIncome.push(node.stats.earnings)
       }
      }
    })

    // Filter for duplicate Wallets
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
    this.setState({ wallets, nodeIncome})
  }

  render() {
    const listItems = this.state.wallets.map(wallet => {
      let balanceRend = 'unknown'
      if (wallet.balance !== null) {
        const balance = PaymentFormat.balance(wallet.balance, 4)
        balanceRend = balance.toString() + ' ' + wallet.token
      }

      return [
        PaymentFormat.wallet(wallet.address),
        balanceRend
      ]
    })

    const wallets = CommonComponents.list(listItems.length !== 0
      ? listItems
      : ['', ''])

    let oneDayIncome = 0
    let sevenDaysIncome = 0
    this.state.nodeIncome.forEach((earnings) => {
      oneDayIncome += parseFloat(earnings.oneDay.toString())
      sevenDaysIncome += parseFloat(earnings.sevenDays.toString())
    })

    const earningRend = CommonComponents.list([
      ["1 Day", `${PaymentFormat.balance(oneDayIncome, 4)} GLM`],
      ["7 Days", `${PaymentFormat.balance(sevenDaysIncome, 4)} GLM`]
    ])
    
    const headerList = CommonComponents.headerList([
      ["Payment Wallets", wallets],
      ["Earnings", earningRend]
    ])

    return (
      <div className="container-fluid wallet card">
        <div className="row">
          <div className="col">
            <h3>Wallet</h3>
          </div>
        </div>
        <div className="row">
          {headerList}
        </div>
      </div>
    )
  }
}

export default Wallet;