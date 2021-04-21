/**
 * Object representing the current state of the Golem Provider
 */
export type GolemNodeResponse = {
  "info": {
    "id": String | null
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