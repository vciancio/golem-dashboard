import GolemNode from '../models/GolemNode';

const headers = {
    'Content-Type': 'application/json',
}

async function getNodeInfo(address) {
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
        let json = await req.json();
        console.log(json);
        return new GolemNode(json);
    }
    return null;
}

const api = {
    getNodeInfo,
};

export default api;