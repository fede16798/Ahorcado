const palabrasDAO = require('../../ServidorPalabrasRandom/data/daoFactory')
const manejadorMail = require('../emails/mailHandler')

let partidas = []
let ultimoId = 0


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

function esPartidaGanada(partida){
    partida.gano = false;
    if(!partida.palabraOculta.includes("-")){
        partida.gano = true;
    }   
    return partida.gano;
}

function notificarResultado(gano, partida){
manejadorMail.mandarMail(gano,partida)
}

function agregarLetraArriesgada(letra){
    letrasArriesgadas.push[letra]
}

function getLetrasArriesgadas(){
    return letrasArriesgadas;
}

function getVidas(){
    return vidas
}

function verificarLetrasEnPalabra (partida, letra) {
    palabra = partida.palabra.toLowerCase();
    letra = letra.toLowerCase();
    palabraOculta = partida.palabraOculta;
    let acertoLetra = false;
    arrayAux = [];
    arrayAux = palabraOculta.split("");
    for (let index = 0; index < palabra.length; index++) {
        if (palabra[index] === letra) {
            //en caso de true, reemplazo el string correspondiente
            arrayAux[index] = letra;
            acertoLetra = true;
        } else { 
        }
    }
    //descuento la vida en caso de que la letra enviada no exista en la palabra de juego
    if (!acertoLetra){
        partida.vidas--;
    }
    palabraOculta = arrayAux.join("");
   
    return palabraOculta;
}



module.exports = {
    getPartidaById,
    agregarPartida,
    generarEstadoPartida,
    ocultarPalabra,
    esPartidaGanada,
    notificarResultado,
    agregarLetraArriesgada,
    getLetrasArriesgadas,
    getVidas,
    verificarLetrasEnPalabra
}