import * as React from 'react';
import GolemNodeSync from '../../utils/GolemNodeSync';
import { Subscription } from 'rxjs';
import GolemProvider from '../../models/GolemProvider';
import { ProviderStatus, ProviderState } from '../common/providerstatus'

type Properties = {
  address: string,
  expandNode: Function
}

type State = {
  isLoaded: Boolean,
  fetchFailed: Boolean,
  name: String | null,
  status: ProviderState,
  version: String | null,
  tasks: Number | null,
  tasksHour: Number | null,
  cpuPercent: Number | null,
}

class NodeListItem extends React.Component<Properties, State> {

  _address: string

  subscriber: Subscription | null = null

  constructor(props: Properties) {
    super(props);
    this._address = props.address
    this.setState({
      isLoaded: false,
      fetchFailed: false,
      status: ProviderState.OFFLINE,
    })

    this._onNodeUpdate = this._onNodeUpdate.bind(this)
    this._onNodeError = this._onNodeError.bind(this)
    this._subscribe = this._subscribe.bind(this)
  }

  componentDidMount() {
    this._subscribe()
  }

  componentWillUnmount() {
    if (this.subscriber) this.subscriber.unsubscribe()
  }

  _subscribe() {
    this.setState({
      isLoaded: false,
      fetchFailed: false,
      status: ProviderState.OFFLINE,
    });
    console.log('Subscribing to ' + this._address);
    this.subscriber =
      GolemNodeSync.subscribeToNode(this._address, this._onNodeUpdate, this._onNodeError)
  }

  async _onNodeUpdate(node: GolemProvider | null) {
    if (node === null) {
      return
    }
    this.setState({
      isLoaded: true,
      fetchFailed: false,
      name: node.info.name,
      version: node.info.version,
      tasks: node.info.processedTotal,
      tasksHour: node.info.processedLastHour,
      cpuPercent: node.hardware.cpu.percentUsage,
      status: node.hardware.isProcessingTask
        ? ProviderState.RUNNING
        : ProviderState.WAITING,
    });
  }

  async _onNodeError() {
    console.log('Unsubscribing from ', this._address)
    if (this.subscriber) this.subscriber.unsubscribe()
    this.subscriber = null
    this.setState({
      isLoaded: false,
      fetchFailed: true,
      name: this.props.address,
      version: null,
      tasks: 0,
      tasksHour: 0,
      cpuPercent: 0,
      status: ProviderState.OFFLINE,
    })
  }

  render() {
    if (!this.state) {
      return (<div />)
    }
    if (!this.state.isLoaded && !this.state.fetchFailed) {
      return this._renderLoading()
    } else {
      return this._renderRow()
    }
  }

  _renderLoading() {
    return (
      <div className="row">
        <div className="col">
          <p>{this.props.address}</p>
        </div>
        <div className="col">
          <p>Loading...</p>
        </div>
        <div className="col">
        </div>
        <div className="col">
        </div>
      </div>
    )
  }

  _renderRow() {
    const expandButton = this.state.status !== ProviderState.OFFLINE
      ? <a onClick={() => this.props.expandNode(this.props.address)} href="#"><i className="fas fa-expand-alt expand-provider"></i></a>
      : null

    const version = this.state.status !== ProviderState.OFFLINE
      ? (<p>{this.state.version}</p>)
      : (<p><a onClick={() => this._subscribe()} href="#">Reconnect <i className="fa fa-refresh expand-provider"></i></a></p>)

    const tasks = this.state.status !== ProviderState.OFFLINE
      ? (<p>{this.state.tasks}</p>)
      : (null)

    return (
      <div className="row">
        <div className="col">
          <p>
            {this.state.name}
            {expandButton}
          </p>
        </div>
        <div className="col">
          <ProviderStatus state={this.state.status} />
        </div>
        <div className="col">
          <p>{version}</p>
        </div>
        <div className="col">
          <p>{tasks}</p>
        </div>
      </div>
    )
  }
}

export default NodeListItem