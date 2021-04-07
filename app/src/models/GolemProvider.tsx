/**
 * Object representing the current state of the Golem Provider
 */
type GolemProvider = {
  "info": {
    "name": String
    "network": String
    "processedLastHour": number
    "processedTotal": number
    "subnet": String
    "version": String
    "wallet": String
  }
  "hardware": {
    "cpu": {
      "percentUsage": number
    };
    "isProcessingTask": Boolean
    "memory": {
      "available": number
      "percent": number
      "used": number
    };
  }
}

export default GolemProvider