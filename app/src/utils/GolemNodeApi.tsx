import GolemProvider from '../models/GolemProvider';

const headers = {
    'Content-Type': 'application/json',
}

async function getNodeInfo(address: String): Promise<GolemProvider|null> {
    if(!address){
        console.log('getNodeInfo: Address was null');
        return null;
    }
    if(!address.startsWith('http')){
        address = 'http://'+address;
    }
    let req = await fetch(address+'/api/status', {
        headers: headers,
    });
    if(req.ok){
        let provider: GolemProvider = await req.json();
        return provider
    }
    return null;
}

const api = {
    getNodeInfo,
};

export default api;