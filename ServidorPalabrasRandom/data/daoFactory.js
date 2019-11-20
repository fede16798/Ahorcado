const palabrasAPI = require('./palabrasAPI');
const palabrasArray = require('./palabrasArray')

function getPalabrasDAO(){
return palabrasAPI
}

module.exports = {
    getPalabrasDAO
}