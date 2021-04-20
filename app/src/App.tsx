import './App.css';
import NodeList from './components/node_list';
import EnvConfig from './utils/EnvConfig';
import NodeInfo from './components/nodeinfo';
import React from 'react';
import Wallet from './components/wallet/Wallet';

type IProps = {}

type IState = {
  isDialogVisible: boolean,
  dialogAddress: String | null
}

class App extends React.Component<IProps, IState> {
 
  constructor(props: IProps){
    super(props)
    this.state = {
      isDialogVisible: false,
      dialogAddress: null
    }
    this._onHide = this._onHide.bind(this)
  }

  _onHide(){
    this.setState({isDialogVisible: false})
  }

  render() {
    let rawNodes = EnvConfig.addresses;
    let nodes: string[] = []
    if (!rawNodes) {
      console.log("No Nodes defined, please update your Environment variable: REACT_APP_ADDRESSES")
    } else {
      nodes = rawNodes.split(',')
    }
  
    return (
      <div className="App">
        <h1>Golem Dashboard</h1>
        <div className="container-fluid">
          <Wallet addresses={nodes}/>
          <NodeList addresses={nodes} expandNode={(address: string) => this.setState({dialogAddress: address, isDialogVisible: true})}/>
        </div>
        <NodeInfo.Modal isVisible={this.state.isDialogVisible} address={this.state.dialogAddress} onHide={this._onHide}/>
      </div>
    );  
  }
}

// function _renderNodesFull(addresses) {
//   return addresses.map((address, index) => (
//     (
//       <div className="row mt-3">
//         <NodeInfo address={address} />
//       </div>
//     )
//   ))
// }

export default App;
