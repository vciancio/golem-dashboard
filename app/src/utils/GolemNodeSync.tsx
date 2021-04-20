import { BehaviorSubject, ReplaySubject } from 'rxjs'
import GolemProvider from '../models/GolemProvider';
import EnvConfig from './EnvConfig'
import GolemNodeApi from './GolemNodeApi'

const POLL_INTERVAL_DEFAULT: number = 5000
const POLLING_RATE: number = EnvConfig.pollingRate ? +EnvConfig.pollingRate : POLL_INTERVAL_DEFAULT;

class GolemNodeSync {

  _nodes: Map<String, BehaviorSubject<GolemProvider|null>>
  _timer: NodeJS.Timeout | null
  _isRunning: Boolean

  constructor() {
    this._nodes = new Map()
    this._timer = null
    this._isRunning = false

    this._loop = this._loop.bind(this)
    this._createNodeSubject = this._createNodeSubject.bind(this)
    Object.seal(this)
  }

  async fetchNode(address: String): Promise<GolemProvider | null>{
    if(this._nodes.has(address)){
      return this._nodes.get(address)!!.getValue()
    }
    return await GolemNodeApi.getNodeInfo(address)
  }

  /** Recieve updates for a node */
  subscribeToNode(
    address: String,
    onUpdate: (g: GolemProvider|null) => void,
    onError: (e: Error) => void) {

    if (!this._nodes.has(address)) {
      this._createNodeSubject(address)
    }
    const subscriber = this._nodes.get(address)!!.subscribe(onUpdate, onError)

    if (!this._isRunning) {
      console.log('Starting Polling Loop')
      this._isRunning = true
      this._loop()
    }
    return subscriber
  }

  _createNodeSubject(address: String) {
    this._nodes.set(address, new BehaviorSubject<GolemProvider|null>(null))
    console.log('Keys: ', this._nodes.keys())
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

    const addresses = Array.from(this._nodes.keys())
    // Stop running if we don't have any addresses to process
    if (addresses.length === 0) {
      this._isRunning = false
      console.warn('No address to poll, stopping loop')
      return
    }

    // Process all of the Nodes
    const promises = addresses.map((v) => this._processAddress(v))
    await Promise.all(promises)
    console.log('Finished processing')

    // Start the loop all over again
    this._timer = setTimeout(() => this._loop(), POLLING_RATE);
  }

  /** Fetch a node and send it to subscribers */
  async _processAddress(address: String) {
    if (!address) {
      console.error('Recieved null address')
      return
    }

    const subject = this._nodes.get(address)
    if (!subject) {
      console.error('No Subject for ' + address)
      return
    }

    try {
      const node = await GolemNodeApi.getNodeInfo(address)
      if (!node) {
        this._nodes.delete(address)
        subject.error(new Error('No node for address'))
        console.warn('Removing ', address, ' from polling list')
        return
      }
      subject.next(node)
    } catch (e) {
      const msg = 'Failed to load data for ' + address
      console.error(msg, e)
      subject.error(e)
      this._nodes.delete(address)
      console.warn('Removing ', address, ' from polling list')
    }
  }
}

const instance = new GolemNodeSync()
export default instance