const request = require('request-promise-native')

const serverUrl = 'http://localhost:5001/api/'

async function crearPartida(mail) {
    const postOpt = {
        method: 'POST',
        uri: serverUrl + 'partida',
        json: true
    }
    if (mail) {
        postOpt.body = mail
    }
    return await request(postOpt)
}

async function arriesgarLetra(letra){
    const postOpt = {
        method: 'POST',
        uri: serverUrl + 'partida/' + 1,
        json: true
    }
    if (letra) {
        postOpt.body = letra
    }
    return await request(postOpt)
}

module.exports = {
    arriesgarLetra,
    crearPartida,
}