const api = require('../api');
const rp = require('request-promise');

const api_url = "http://localhost:8080/api/palabra";


async function seleccionarPalabra(){ 
    const result = await rp (api_url);
    // const {result} = await rp(api_url);
    // console.log({result})
    // console.log(result)
    return JSON.parse(result);
}

module.exports = {
    seleccionarPalabra,
}

