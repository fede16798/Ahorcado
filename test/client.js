const request = require('request-promise-native')

const serverUrl = 'http://localhost:5001/api/'

async function crearPartida(mail) {
    const postOpt = {
        method: 'POST',
        uri: serverUrl + 'partidas',
        json: true
    }
    if (mail) {
        postOpt.body = mail
    }
    return await request(postOpt)
}

async function arriesgarLetra(letra, id){
    const postOpt = {
        method: 'PATCH',
        uri: serverUrl + 'partidas/' + 1,
        json: true
    }
    if (letra) {
        postOpt.body = letra
    }
    return await request(postOpt)
}

async function buscarPorId(id) {
    return await request({
        method: 'GET',
        uri: serverUrl + 'partidas/' + id,
        json: true
    })
}

async function buscarTodos() {
    return await request({
        method: 'GET',
        uri: serverUrl + 'partidas',
        json: true
    })
}


module.exports = {
    arriesgarLetra,
    crearPartida,
    buscarPorId,
    buscarTodos
}