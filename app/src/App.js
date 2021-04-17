import './App.css';
import NodeList from './components/node_list';
import NodeInfo from './components/nodeinfo/NodeInfo';
import EnvConfig from './utils/EnvConfig';

function App() {
  let rawNodes = EnvConfig.addresses;
  let nodes = []
  if (!rawNodes) {
    console.log("No Nodes defined, please update your Environment variable: REACT_APP_ADDRESSES")
  } else {
    nodes = rawNodes.split(',')
  }

  return (
    <div className="App">
      <h1>Golem Dashboard</h1>
      <div className="container-fluid">
        <NodeList addresses={nodes} />
        {/* {_renderNodesFull(nodes)} */}
      </div>
    </div>
  );
}

function _renderNodesFull(addresses) {
  return addresses.map((address, index) => (
    (
      <div className="row mt-3">
        <NodeInfo address={address} />
      </div>
    )
  ))
}

export default App;
