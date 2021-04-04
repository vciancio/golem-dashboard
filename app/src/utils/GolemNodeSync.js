import { Subject } from 'rxjs'
import EnvConfig from './EnvConfig'
import GolemNodeApi from './GolemNodeApi'

const POLL_INTERVAL_DEFAULT = 5000
const POLLING_RATE = EnvConfig.pollingRate ? EnvConfig.pollingRate : POLL_INTERVAL_DEFAULT;

class GolemNodeSync {

  /*
   * _nodes: {
   *  "192.168.1.100" : ReplaySubject (Golem Node)
   * }
   */

  constructor() {
    this._nodes = {}
    this._timer = null
    this._isRunning = false

    this._loop = this._loop.bind(this)
    this._createNodeSubject = this._createNodeSubject.bind(this)
    Object.seal(this)
  }

  /**
   * Recieve updates for a node
   * @param {String} address 
   * @param {Callback} subscription 
   * @returns {Subscriber} subscriber
   */
  subscribeToNode(address, onUpdate, onError) {
    if (!(address in this._nodes)) {
      this._createNodeSubject(address)
    }
    const subscriber = this._nodes[address].subscribe(onUpdate, onError)

    if (!this._isRunning) {
      console.log('Starting Polling Loop')
      this._isRunning = true
      this._loop()
    }
    return subscriber
  }

  _createNodeSubject(address) {
    this._nodes[address] = new Subject()
  }

  async _loop() {
    if (!this._isRunning) {
      console.warn('Loop is not supposed to be running...')
      return
    }

    // Clear the timer if this is running sooner than interval
    if (this._timer !== null) {
      clearTimeout(this._timer)
    }
    this._timer = null

    const addresses = Object.keys(this._nodes)
    // Stop running if we don't have any addresses to process
    if (addresses.length === 0) {
      this._isRunning = false
      console.warn('No address to poll, stopping loop')
      return
    }

    // Process our Nodes
    const promises = addresses.map((v) => this._processAddress(v))
    await Promise.all(promises)
    console.log('Finished processing')

    // Start the loop all over again
    this._timer = setTimeout(() => this._loop(), POLLING_RATE);
  }

  /**
   * Fetch a node and send it to subscribers
   * @param {String} address 
   */
  async _processAddress(address) {
    if (!address) {
      console.error('Recieved null address')
      return
    }

    const subject = this._nodes[address]
    if (!subject) {
      console.error('No Subject for ' + address)
      return
    }

    try {
      const node = await GolemNodeApi.getNodeInfo(address)
      subject.next(node)
    } catch (e) {
      const msg = 'Failed to load data for ' + address
      console.error(msg, e)
      subject.error(e)
      delete this._nodes[address]
      console.warn('Removing ', address, ' from polling list')
    }
  }
}

const instance = new GolemNodeSync()
export default instance