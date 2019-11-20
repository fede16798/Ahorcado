const partidaDB = require('./partidaDB')
const partida = require('./partida')

function getPartidaDAO(){
return partidaDB
}

module.exports = {
    getPartidaDAO
}