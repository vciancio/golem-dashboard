
function _getHttpApi(network) {
  let api;
  if (network === 'mainnet') {
    api = "https://api.zksync.io";
  } else {
    api = `https://${network}-api.zsysnc.io`;
  }
  return api
}

/**
 * Returns Committed Balance
 * 
 * POST /jsrpc - account_info
 * Request:
 * {
 *     "id":1,
 *     "jsonrpc":"2.0",
 *     "method":"account_info",
 *     "params":[address]
 * }
 * 
 * 
 * Response:
 * {
 *     "jsonrpc": "2.0",
 *     "result": {
 *         "address": "0xa96...30b",
 *         "id": 368425,
 *         "depositing": {
 *             "balances": {}
 *         },
 *         "committed": {
 *             "balances": {
 *                 "GLM": "14795221192654296900000"
 *             },
 *             "nonce": 3362,
 *             "pubKeyHash": "sync:dcc...805"
 *         },
 *         "verified": {
 *             "balances": {
 *                 "GLM": "14810731705478697900000"
 *             },
 *             "nonce": 3203,
 *             "pubKeyHash": "sync:dcc...805"
 *         }
 *     },
 *     "id": 1
 * }
 */
async function getBalance(network, address, token) {
  const api = _getHttpApi(network)
  try {
    const req = await fetch(
      `${api}/jsrpc`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "account_info",
          params: [address]
        })
      },
    )
    if (!req.ok) {
      console.log('Failed to fetch account from ZSync: ' + req.status)
      return -1;
    }
    const json = await req.json()
    if (!json.result) {
      console.log('Returned value from ZkSync was null')
      return 0
    }
    if (!json.result.committed.balances) {
      console.log('No Committed Balance atm')
      return 0
    }
    const amount = json.result.committed.balances[token]
    return amount ? amount/Math.pow(10,18) : 0
  } catch (e) {
    console.log('Exception thrown when fetching account from ZSync', e);
    return null;
  }
}

const ZSyncApi = {
  getBalance
}

export default ZSyncApi