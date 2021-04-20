import React from 'react'
import NodeInfo from './NodeInfo'
import NodeInfoTitle from './NodeInfoTitle'

type IProps = {
  address: String
}

class NodeInfoCard extends React.Component<IProps> {
  render() {
    return (
      <div className="card">
        <h2 className="card-title"><NodeInfoTitle address={this.props.address}/></h2>
        <NodeInfo address={this.props.address}/>
      </div>
    )
  }
}

export default NodeInfoCard