import React from 'react';
import GolemNodeApi from '../../utils/GolemNodeApi';
import GaugeChart from 'react-gauge-chart'

const POLL_INTERVAL = 5000

class NodeInfo extends React.Component {
  golemNode = null

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
    this.timer = setInterval(() => this._pollFetch(), POLL_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
    this.setState({ isLoaded: false, fetchFailed: false })
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
    console.log('Poll Fetch: ' + address);
    this._fetchNodeInfo(address)
  }

  _fetchNodeInfo(address) {
    if (!address) {
      return
    }
    GolemNodeApi.getNodeInfo(address)
      .then(node => {
        this.golemNode = node
        this.setState({ isLoaded: true, fetchFailed: false });
      })
      .catch(error => {
        console.log('Failed to load data for ' + address)
        this.setState({ isLoaded: false, fetchFailed: true });
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
        || this.golemNode.hardware === null){
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
          {this._renderTasks(node)}
          {this._renderCpu(node)}
          {this._renderMemory(node)}
        </div>
      </div>
    );
  }

  _renderNetwork(node) {
    let wallet = [
      node.info.wallet.substring(0, 5),
      node.info.wallet.substring(node.info.wallet.length - 3, node.info.wallet.length)
    ].join('...')

    return this._renderCardListGroup({
      title: "Node Info",
      items: [
        ["Version", node.info.version],
        ["Network", node.info.network],
        ["Subnet", node.info.subnet],
        ["Wallet", wallet],
      ]
    }, "col-md-4")
  }

  _renderTasks(node) {
    return this._renderCardListGroup({
      title: "Tasks Processed",
      items: [
        ["All Time", node.info.processedTotal],
        ["Last Hour", node.info.processedLastHour]
      ]
    })
  }

  _renderCpu(node) {
    let cpuPercent = node.hardware.cpu.percentUsage
    return (
      <div className="col">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">CPU Usage</h5>
            <GaugeChart id="gauge-chart3"
              nrOfLevels={31}
              colors={["#09af00", "#F44336"]}
              arcWidth={0.3}
              percent={cpuPercent / 100}
              textColor="#000000"
              animateDuration={3000}
            />
          </div>
        </div>
      </div>
    )
  }

  _renderMemory(node) { 
    let memoryPercent = node.hardware.memory.percent
    return (
      <div className="col">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Memory Usage</h5>
            <GaugeChart id="gauge-chart3"
              nrOfLevels={31}
              colors={["#09af00", "#F44336"]}
              arcWidth={0.3}
              percent={memoryPercent / 100}
              textColor="#000000"
              animateDuration={3000}
            />
          </div>
        </div>
      </div>
    )

  }

  _renderCardListGroup(listGroup, size="") {
    let title = listGroup.title
    let items = listGroup.items
    let className = ["col", size].join(" ");
    return (
      <div className={className}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <ul className="list-group">
              {items.map((item, index) => (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {item[0]}
                  <span className="badge">{item[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default NodeInfo;