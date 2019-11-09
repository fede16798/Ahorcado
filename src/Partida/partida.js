const manejadorMail = require("../emails/mailHandler")
const palabrasDAO = require('../../ServidorPalabrasRandom/data/daoFactory')

let partidas = []
let ultimoId = 0
const palabras= ["auto" , "moto", "odontologo", "medico", "profesor", "computadora", "cuatriciclo" , "monopatin"];



function getPartidaById(id) {
    return partidas.find(u => u.id == id)
}

function agregarPartida(partida , email) {
    partida.id = ultimoId + 1;
    partida.palabra = palabrasDAO.getPalabrasDAO().seleccionarPalabra();
    partida.palabraOculta = ocultarPalabra(partida.palabra);
    partida.mail = email;
    partida.vidas = 3;
    partida.letrasArriesgadas = [];
    partida.gano = false;
    partidas.push(partida)
    ultimoId++

    return partida;
}

function generarEstadoPartida(partida){ 
    let partidaAMostrar = {};
    partidaAMostrar.id = partida.id;
    partidaAMostrar.vidas = partida.vidas;
    partidaAMostrar.palabraOculta = partida.palabraOculta;
    partidaAMostrar.letrasArriesgadas = partida.letrasArriesgadas;

    return partidaAMostrar;
}

function ocultarPalabra(palabra){
    let num;
    let palabraOcult = "";
    //consigo cantida de guiones necesarios
    for (let index = 0; index < palabra.length; index++) {
        num = index;
    }
    num++;
   // iguala la palabra oculta a la palabra elegida
    for (let i = 0; i < num; i++){
       palabraOcult = ("-" + palabraOcult)
    }

    console.log("cantidad de letras " + num );
    console.log("palabra oculta " + palabraOcult);

    return palabraOcult;
}



module.exports = {
    getPartidaById,
    agregarPartida,
    generarEstadoPartida,
    ocultarPalabra
}