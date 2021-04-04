import './NodeInfo.css';
import React from 'react';
import ZSyncApi from '../../utils/ZSyncApi';
import GolemNodeSync from '../../utils/GolemNodeSync';
import CommonComponents from '../common/CommonComponents'

const LINK_ZKSCAN_ACCOUNT = "https://zkscan.io/explorer/accounts"

class NodeInfo extends React.Component {
  golemNode = null
  subscriber = null

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false
    };
    this._processNode = this._processNode.bind(this);
  }

  componentDidMount() {
    let address = this.props.address;
    console.log('Subscribing to ' + address);
    this.subscriber = GolemNodeSync.subscribeToNode(address, this._processNode)
  }

  componentWillUnmount() {
    this.subscriber.unsubscribe()
    this.setState({
      isLoaded: false,
      fetchFailed: false,
      ethAddr: null,
      glmBalance: null,
      token: null
    })
  }

  async _processNode(node) {
    this.golemNode = node
    const token = node.info.network === 'mainnet' ? 'GLM' : 'tGLM'
    const glmBalance = await ZSyncApi.getBalance(
      node.info.network,
      node.info.wallet,
      token
    )
    this.setState({
      isLoaded: true,
      fetchFailed: false,
      ethAddr: node.info.wallet,
      glmBalance: glmBalance,
      token: token
    });
  }

  render() {
    if (this.state.fetchFailed) {
      return this._renderLoadFailed()
    }
    if (!this.state.isLoaded) {
      return this._renderLoading()
    }
    if (this.golemNode === null
      || this.golemNode.info === null
      || this.golemNode.hardware === null) {
      return this._renderLoadFailed()
    }
    return this._renderNode(this.golemNode)
  }

  _renderLoading() {
    const address = this.props.address
    const items = [
      ["Status", (<div className="spinner-border" role="status" />)],
      ["Version"],
      ["Network"]
    ]

    return (
      <div className="card">
        <h2 className="card-title">{address}</h2>
        <div className="container-fluid">
          <div className="row">
            {CommonComponents.headerList(items)}
          </div>
        </div>
      </div>
    );
  }

  _renderLoadFailed() {
    const address = this.props.address
    const items = [
      ["Status", (<span className="offline" role="status">Offline</span>)],
      ["Version"],
      ["Network"]
    ]

    return (
      <div className="card">
        <h2 className="card-title">{address}</h2>
        <div className="container-fluid">
          <div className="row">
            {CommonComponents.headerList(items)}
          </div>
          <div className="row mt-3">
            <div className="col">
              <button className="btn btn-primary" onClick={this._retryFetch}>Retry</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _renderNode(node) {
    let name = node.info.name
    return (
      <div className="card">
        <h2 className="card-title">{name}</h2>
        <div className="container-fluid">
          <div className="row">
            {this._renderStatus(node)}
          </div>
          <div className="row mt-3">
            {this._renderHardware(node)}
            {this._renderTotalTasks(node)}
          </div>
          <div className="row mt-3">
            {this._renderPayment(
              node,
              this.state.ethAddr,
              this.state.token,
              this.state.glmBalance)}
          </div>
        </div>
      </div>
    )
  }

  _renderStatus(node) {
    const status = node.hardware.isProcessingTask
      ? (<div className="running">Running Task</div>)
      : (<div className="standby">Waiting for Task</div>);

    const network = node.info.network
    const subnet = node.info.subnet
    const networkRend = (
      <div>
        {network}
        <br />
        {subnet}
      </div>
    )

    return CommonComponents.headerList([
      ["Status", status],
      // ["Uptime", "188h 19m"],
      // ["Last Task", "5m ago"],
      ["Version", node.info.version],
      ["Network", networkRend]
    ])
  }

  _renderHardware(node) {
    const memoryPercent = node.hardware.memory.percent
    const cpuUsage = Math.round(node.hardware.cpu.percentUsage)
    const cpuRend = cpuUsage.toString() + "%"

    let cpuClass;
    if (cpuUsage >= 80) {
      cpuClass = "percent-high"
    } else if (cpuUsage >= 50) {
      cpuClass = "percent-mid"
    } else {
      cpuClass = ""
    }

    const list = CommonComponents.list([
      ["CPU Usage", (<span className={cpuClass}>{cpuRend}</span>)],
      ["Used Memory", memoryPercent.toString() + "%"],
    ]);
    return (
      <div className="col mt-2">
        <h5>System</h5>
        {list}
      </div>
    )
  }

  _renderTotalTasks(node) {
    const tasks = node.info.processedTotal;
    const tasks1h = node.info.processedLastHour;
    const rend = CommonComponents.list([
      ["Total # of Tasks", tasks],
      ["Tasks past hour", tasks1h]
    ])
    return (
      <div className="col mt-2">
        <h5>Tasks</h5>
        {rend}
      </div>
    )
  }

  _renderPayment(node, ethAddr, token, balance) {
    const walletRend = (
      <div className="col">
        <h5>Wallet</h5>
        {_shrinkWallet(ethAddr)}
      </div>
    )

    const balanceRend = (
      <div className="col-6">
        <h5>ZSync Balance</h5>
        {_formatBalance(balance).toString() + " " + token}
      </div>
    )

    const link = `${LINK_ZKSCAN_ACCOUNT}/${ethAddr}`
    const rendButton = (
      <div className="col">
        <a class="btn btn-primary mt-2" href={link}>View in ZkScan</a>
      </div>
    )

    return (
      <div className="col mt-2 card">
        <h5>Payment</h5>
        <div className="container headerList">
          <div className="row">
            {walletRend}
            {balanceRend}
            {rendButton}
          </div>
        </div>
      </div>
    )
  }
}

/** ETH Addresses are really long, need to shorten. */
function _shrinkWallet(ethAddr) {
  return [
    ethAddr.substring(0, 6),
    ethAddr.substring(ethAddr.length - 5, ethAddr.length)
  ].join('...')
}

/** Balances are really long, need to shorten. */
function _formatBalance(balance, decimals = 7) {
  const mod = Math.pow(10, decimals)
  let friendlyBalance = balance == null ?
    "unknown" :
    Math.floor(balance * mod) / mod

  if (typeof friendlyBalance !== 'string') {
    friendlyBalance = friendlyBalance.toString() + '...'
  }
  return friendlyBalance
}

export default NodeInfo;