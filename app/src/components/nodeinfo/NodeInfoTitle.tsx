import React from 'react'
import { Subscription } from 'rxjs';
import GolemNodeSync from '../../utils/GolemNodeSync';
import GolemProvider from '../../models/GolemProvider';

type IProps = {
  address: String
}

type IState = {
  title: String
}

class NodeInfoTitle extends React.Component<IProps, IState> {

  _subscriber: Subscription | null = null

  constructor(props: IProps) {
    super(props)
    this.state = { title: props.address }

    this._onNodeUpdate = this._onNodeUpdate.bind(this)
    this._onNodeError = this._onNodeError.bind(this)
    this._subscribe = this._subscribe.bind(this)
  }

  componentDidMount() {
    this._subscribe()
  }

  componentWillUnmount() {
    if (this._subscriber) this._subscriber.unsubscribe()
  }

  _subscribe() {
    this._subscriber =
      GolemNodeSync.subscribeToNode(this.props.address, this._onNodeUpdate, this._onNodeError)
  }

  async _onNodeUpdate(node: GolemProvider | null) {
    if (node === null) {
      return
    }
    this.setState({
      title: node.info.name
    })
  }

  async _onNodeError() {
    // No-Op
  }

  render() {
    return this.state.title
  }
}

export default NodeInfoTitle