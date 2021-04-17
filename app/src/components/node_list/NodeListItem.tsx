import * as React from 'react';
import GolemNodeSync from '../../utils/GolemNodeSync';
import { Subscription } from 'rxjs';
import GolemProvider from '../../models/GolemProvider';
import { ProviderStatus, ProviderState } from '../common/providerstatus'

type Properties = {
  address: string
}

type State = {
  isLoaded: Boolean,
  fetchFailed: Boolean,
  name: String | null,
  status: ProviderState,
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

  async _onNodeUpdate(node: GolemProvider) {
    this.setState({
      isLoaded: true,
      fetchFailed: false,
      name: node.info.name,
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
      tasks: 0,
      cpuPercent: 0,
      status: ProviderState.OFFLINE,
    })
  }

  render() {
    if (!this.state) {
      return (<div />)
    }
    if (!this.state.isLoaded && !this.state.fetchFailed) {
      return (
        <div className="card">Loading</div>
      )
    } else if (this.state.fetchFailed) {
      return (
        <div className="card">Failed</div>
      )
    }
    else {
      return this._renderRow()
    }
  }

  _renderRow() {    
    return (
        <div className="row">
          <div className="col">
            <p>{this.state.name}</p>
          </div>
          <div className="col">
            <ProviderStatus state={this.state.status}/>
          </div>
          <div className="col">
            <p>{this.state.tasks}</p>
          </div>
          <div className="col">
            <p>{this.state.tasksHour}</p>
          </div>
        </div>
    )
  }
}

export default NodeListItem