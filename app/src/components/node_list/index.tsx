import * as React from 'react';
import NodeListItem from './NodeListItem';

type IProperties = {
  addresses: string[]
}


class NodeList extends React.Component<IProperties> {

  render() {
    const nodes = this.props.addresses.map((address) => {
      return <NodeListItem address={address}/>
    })
  
    return (
      <div className="container mt-5">
        {this._renderHeader()}
        {nodes}
      </div>
    )
  }

  _renderHeader() {
    return (
      <div className="row">
        <div className="col">
          <p>Provider Name</p>
          {/* <h4>{name}</h4> */}
        </div>
        <div className="col">
          <p>Status</p>
          {/* <p>test2</p> */}
        </div>
        <div className="col">
          <p>Total # of Tasks</p>
        </div>
        <div className="col">
          <p>Tasks Past Hour</p>
        </div>
      </div>
    )
  }
}

export default NodeList