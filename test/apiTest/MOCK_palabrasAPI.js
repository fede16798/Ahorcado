const api = require('./MOCK_api');
const rp = require('request-promise');

const api_url = "http://localhost:8081/api/palabra";


async function seleccionarPalabra(){ 
    try{
        const result = await rp (api_url);
        return JSON.parse(result);
    }catch(err){
        throw { status: 500, descripcion: 'No se pudo obtener la palabra' }
    }
    
    // const {result} = await rp(api_url);
    // console.log({result})
    // console.log(result)
    
}


module.exports = {
    seleccionarPalabra,
}

