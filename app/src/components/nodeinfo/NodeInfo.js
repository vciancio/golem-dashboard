import React from 'react';
import GolemNodeApi from '../../utils/GolemNodeApi';
import GaugeChart from 'react-gauge-chart';
import ZSyncApi from '../../utils/ZSyncApi';
import EnvConfig from '../../utils/EnvConfig';
import CommonRender from '../../utils/CommonRender'

// import { getDefaultProvider, Wallet } from 'zksync'
// import { ethers } from 'ethers'

const POLL_INTERVAL = EnvConfig.pollingRate
const POLL_INTERVAL_DEFAULT = 5000
const LINK_ZKSCAN_ACCOUNT = "https://zkscan.io/explorer/accounts"

class NodeInfo extends React.Component {
  golemNode = null
  timer = null

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false
    };
    this._retryFetch = this._retryFetch.bind(this);
    this._pollFetch = this._pollFetch.bind(this);
    this._fetchNodeInfo = this._fetchNodeInfo.bind(this);
  }

  componentDidMount() {
    let address = this.props.address;
    console.log('Initial Fetch: ' + address);
    this._fetchNodeInfo(address);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
    this.setState({
      isLoaded: false,
      fetchFailed: false,
      ethAddr: null,
      glmBalance: null,
      token: null
    })
  }

  _retryFetch() {
    this.setState({ isLoaded: false, fetchFailed: false });
    let address = this.props.address;
    console.log('Retry Fetch: ' + address);
    this._fetchNodeInfo(address)
  }

  _pollFetch() {
    if (!this.state.isLoaded || this.state.fetchFailed) {
      // Don't try to poll if we aren't loaded right now
      return
    }
    let address = this.props.address;
    this._fetchNodeInfo(address)
  }

  async _fetchNodeInfo(address) {
    if (!address) {
      return
    }

    clearTimeout(this.timer)
    this.timer = null

    try {
      const node = await GolemNodeApi.getNodeInfo(address)
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
      // Start our timer 
      const interval = POLL_INTERVAL ? POLL_INTERVAL : POLL_INTERVAL_DEFAULT;
      this.timer = setTimeout(() => this._pollFetch(), interval);
    } catch (e) {
      console.log('Failed to load data for ' + address, e)
      this.setState({ isLoaded: false, fetchFailed: true });
    };
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
    return (
      <div className="card">
        <h2>{this.props.address}</h2>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status" />
        </div>
      </div>
    );
  }

  _renderLoadFailed() {
    return (
      <div className="card">
        <h2>{this.props.address}</h2>
        <div className="card-body">
          <h5>Failed to connect</h5>
          <button className="btn btn-primary" onClick={this._retryFetch}>Retry</button>
        </div>
      </div>
    )
  }

  _renderNode(node) {
    let name = node.info.name
    return (
      <div className="container-fluid">
        <h2>{name}</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
          {this._renderNetwork(node)}
          {this._renderWallet(
            this.state.ethAddr,
            this.state.token,
            this.state.glmBalance)}
          {this._renderTasks(node)}
          {this._renderCpu(node)}
          {this._renderMemory(node)}
        </div>
      </div>
    );
  }

  _renderNetwork(node) {
    const listRend = CommonRender.list([
      ["Version", node.info.version],
      ["Network", node.info.network],
      ["Subnet", node.info.subnet],
    ])
    return CommonRender.card(
      "Node Info", listRend, "col-md-4")
  }

  _renderTasks(node) {
    const isProcessing = node.hardware.isProcessingTask
    const listRend = CommonRender.list([
      ["All Time", node.info.processedTotal],
      ["Last Hour", node.info.processedLastHour],
      ["Is Running Task", isProcessing == null ? 'unknown' : isProcessing.toString()]
    ])
    return CommonRender.card("Tasks Processed", listRend)
  }

  _renderCpu(node) {
    let cpuPercent = node.hardware.cpu.percentUsage
    return CommonRender.card("CPU Usage", (
      <GaugeChart id="gauge-cpu"
        nrOfLevels={31}
        colors={["#09af00", "#F44336"]}
        arcWidth={0.3}
        percent={cpuPercent / 100}
        textColor="#000000"
        animateDuration={3000}
      />
    ));
  }

  _renderMemory(node) {
    let memoryPercent = node.hardware.memory.percent
    return CommonRender.card("Memory Usage", (
      <GaugeChart id="gauge-memory"
        nrOfLevels={31}
        colors={["#09af00", "#F44336"]}
        arcWidth={0.3}
        percent={memoryPercent / 100}
        textColor="#000000"
        animateDuration={3000}
      />
    ));
  }

  _renderWallet(ethAddr, token, balance = -1) {
    if (!ethAddr) {
      return
    }

    // ETH Addresses are really long, need to shorten to only 4 decimal places.
    const wallet = [
      ethAddr.substring(0, 5),
      ethAddr.substring(ethAddr.length - 3, ethAddr.length)
    ].join('...')

    // Balances are really long, need to shorten to only 4 decimal places.
    let friendlyBalance = balance == null ?
      "unknown" :
      Math.floor(balance * 1000000) / 1000000

    if (typeof friendlyBalance !== 'string') {
      friendlyBalance = friendlyBalance.toString() + '...'
    }

    const rendList = CommonRender.list([
      ["Address", wallet],
      [`${token} in ZkSync`, friendlyBalance],
    ])

    const link = `${LINK_ZKSCAN_ACCOUNT}/${ethAddr}`
    const rendButton = (
      <a class="btn btn-primary" href={link}>View in ZkScan</a>
    )

    return CommonRender.card("Payment Info", [
      rendList,
      rendButton
    ])
  }
}

export default NodeInfo;