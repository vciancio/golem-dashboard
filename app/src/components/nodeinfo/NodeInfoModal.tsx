import './NodeInfo.css'
import React from 'react'
import { Modal } from 'react-bootstrap'
import NodeInfo from './NodeInfo'
import NodeInfoTitle from './NodeInfoTitle'

type IProps = {
  address: String | null,
  isVisible: boolean,
  onHide: Function
}

class NodeInfoDialog extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props)
    this.state = {isVisible: this.props.isVisible}
  }

  _hide() {
    this.setState({isVisible: false})
  }

  render() {
    const node = (<NodeInfo address={this.props.address} />)
    const header = (
      this.props.address !== null 
      ? <NodeInfoTitle address={this.props.address}/> 
      : null
    )
    console.info('Render:', 'isVisible:', this.props.isVisible, ', address:', this.props.address)
    return (
      <Modal show={this.props.isVisible} onHide={this.props.onHide}>
        <Modal.Header closeButton >
          <h3>{header}</h3>
        </Modal.Header>
        <Modal.Body>
          {this.props.address !== null ? node : null}
        </Modal.Body>
      </Modal>
    )
  }
}

export default NodeInfoDialog