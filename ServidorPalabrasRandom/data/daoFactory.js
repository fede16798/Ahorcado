const palabrasAPI = require('./api');
const palabrasArray = require('./palabrasArray')

function getPalabrasDAO(){
return palabrasArray
}

module.exports = {
    getPalabrasDAO
}