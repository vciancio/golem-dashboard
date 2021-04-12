import React from 'react'

enum ProviderState {
  OFFLINE = -1,
  WAITING = 0,
  RUNNING = 1
}

type Props = {
  state: ProviderState
}

class ProviderStatus extends React.Component {

  _state: ProviderState = ProviderState.OFFLINE

  constructor(props: Props) {
    super(props)
    this._state = props.state
  }

  render() {
    let c: string
    let text: string
    switch (this._state) {
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
        console.error("ProviderStatus: Invalid state ", this._state)
        return null
    }
    return <span className={c}>{text}</span>
  }
}

export { ProviderStatus, ProviderState }