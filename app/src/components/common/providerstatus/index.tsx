import './ProviderStatus.css'
import React from 'react'

enum ProviderState {
  OFFLINE = -1,
  WAITING = 0,
  RUNNING = 1
}

type IProps = {
  state: ProviderState
}

class ProviderStatus extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props)
  }

  render() {
    let c: string
    let text: string
    switch (this.props.state) {
      case ProviderState.OFFLINE:
        c = "offline"
        text = "Offline"
        break
      case ProviderState.RUNNING:
        c = "running"
        text = "Running"
        break
      case ProviderState.WAITING:
        c = "standby"
        text = "Waiting for Task"
        break;
      default:
        console.error("ProviderStatus: Invalid state ", this.props.state)
        return null
    }
    return <span className={c}>{text}</span>
  }
}

export { ProviderStatus, ProviderState }