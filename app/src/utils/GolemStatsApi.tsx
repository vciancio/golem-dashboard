import { Earnings } from '../models/GolemStatsApiModel'
const BASE_API = "https://api.golemstats.com/v1"

/**
 * Returns Earnings for a given Node
 * GET https://api.golemstats.com/v1/provider/node/{id}}/earnings/{hours}
 */
export async function getEarnings(providerId: String, hours: number): Promise<number>{
    const api = `${_getProviderNodeApi(providerId)}/earnings/${hours}`
    try {
        const req = await fetch(api)
        if(!req.ok){
            console.error('Failed to fetch earnings for ${providerId}')
            return 0
        }
        const json: Earnings = await req.json()
        if(!json.earnings){
            console.error('Returned value for Earnings was null')
            return 0
        }
        return json.earnings
    } catch (e) {
        console.error(`Exception thrown when fetching earnings for ${providerId}`, e)
        return 0;
    }
}

function _getProviderNodeApi(providerId: String): String {
    return `${BASE_API}/provider/node/${providerId}`
}

const api = {
    getEarnings
}
export default api