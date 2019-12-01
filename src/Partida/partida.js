const palabrasDAO = require('../../ServidorPalabrasRandom/data/daoFactory')
const manejadorMail = require('../emails/mailHandler')
const Joi = require('@hapi/joi')

let partidas = []
let ultimoId = 0


function getPartidaById(id) {
    return partidas.find(u => u.id == id)
}

async function agregarPartida(email) {
    let partida = {};
    objetoRecibido = await palabrasDAO.getPalabrasDAO().seleccionarPalabra();

      if( await validarPalabraRecibida(objetoRecibido)){
        throw { status: 500 , descripcion: 'No se pudo crear la partida por haber recibido una palabra con formato invalido desde la API' } 
    }else{
         partida.id = ultimoId + 1;    
    partida.palabra = objetoRecibido.palabra;
    partida.definicion = objetoRecibido.definicion;
    partida.palabraOculta = ocultarPalabra(partida.palabra);
    partida.mail = email;
    partida.vidas = 2;
    partida.letrasArriesgadas = [];
    partida.gano = false;
    partidas.push(partida);
    ultimoId++; 
      }

    return partida;
    }

function validarPalabraRecibida (palabraRecibida){
    const esquema = {
        palabra: Joi.string().required(),
        definicion: Joi.string().required()
    }
    const {error} = Joi.validate(palabraRecibida, esquema)

    return error;
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
let palabraNueva = String(palabra);

for (let index = 0; index < palabraNueva.length; index++){
    num = index;
}
num++;

for(let i = 0; i < num; i++){
    palabraOcult = ("-" + palabraOcult);
}

console.log("cantidad de letras " + num)
console.log("Palabra oculta " + palabraOcult)

return palabraOcult
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

function getPartidas(){
    return partidas;
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
    verificarLetrasEnPalabra,
    getPartidas
}