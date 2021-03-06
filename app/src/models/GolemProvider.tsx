/**
 * Object representing the current state of the Golem Provider.
 * Includes data from GolemStats as well as Golem-Dash-Server
 */
export type GolemProvider = {
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
  },
  "stats": {
    "earnings": ProviderEarnings | null
  }
}

export type ProviderEarnings = {
  "oneDay": number,
  "sevenDays": number
}

export default GolemProvider