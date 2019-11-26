const partidaDB = require('./partidaDB')
const partida = require('./partida')

function getPartidaDAO(){
return partida
}

module.exports = {
    getPartidaDAO
}