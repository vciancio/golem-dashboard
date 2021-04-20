import React from 'react'
import { Modal } from 'react-bootstrap'
import NodeInfo from './NodeInfo'

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
    console.info('Render:', 'isVisible:', this.props.isVisible, ', address:', this.props.address)
    return (
      <Modal show={this.props.isVisible} onHide={this.props.onHide}>
        <Modal.Header closeButton />
        <Modal.Body>
          {this.props.address !== null ? node : null}
        </Modal.Body>
      </Modal>
      // <div className="modal fade" id="nodeInfo" role="dialog" aria-labelledby="exampleModalCenterTitle">
      //   <div className="modal-dialog" role="document">
      //     <div className="modal-content">
      //       <div className="modal-body">
      //         <p>This is a Test</p>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    )
  }
}

export default NodeInfoDialog