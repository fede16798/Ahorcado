const express = require('express')
const Joi = require('@hapi/joi')
const _ = require('lodash')
const manejadorMail = require("../emails/mailHandler")

// const juego = require('juego/juego.js');

const app = express()

app.use(express.json())
app.set('json spaces', 4)

// base de datos

let partidas = []
let ultimoId = 0
const palabras= ["auto" , "moto", "odontologo", "medico", "profesor", "computadora", "cuatriciclo" , "monopatin"];

app.get('/api/partidas', (req, res) => {
    console.log('GETTING: ' + req.url)
    try {
        let result
        if (_.isEmpty(req.query)) {
            result = getAllPartidas()
        } else if (req.query.hasOwnProperty('id')) {
            result = getPartidaById(req.query.id);
        } else {
            throw { status: 400, descripcion: 'parametros de consulta invalidos' }
        }
        res.json(result)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.get('/api/partida/:id', (req, res) => {
    console.log('GETTING: ' + req.url)
    try {
        const partidaBuscada = getPartidaById(req.params.id)

        if (!partidaBuscada) {
            throw { status: 404, descripcion: 'partida no encontrado' }
        }
        res.json(partidaBuscada)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

//este post es para iniciar una partida
app.post('/api/partida', (req, res) => {
    console.log('POSTING: ' + req.url)

    const nuevaPartida = req.body

    try {
        if (esPartidaInvalida(nuevaPartida)) {
            throw { status: 400, descripcion: 'el partida posee un formato json invalido o faltan datos' }
        }
        const partidaBuscada = getPartidaById(nuevaPartida.id);

        if (partidaBuscada) {
            throw { status: 400, descripcion: 'ya existe un partida con ese id' }
        }; 
        

        agregarPartida(nuevaPartida, req.body.mail);

        partidaAux = generarEstadoPartida(nuevaPartida);
        res.status(201).json(partidaAux);

    } catch (err) {
        console.log(err)
        res.status(err.status).json(err);
    }
})

//este post es para arriesgar letra
app.post('/api/partida/:id', (req, res) => {
    console.log('POSTING: arriesgando letra en la partida ' + req.url);

    const letra = req.body.letra;
    try {
         if (esLetraInvalida(req.body)){
            throw { status: 400, descripcion: 'La letra ingresada no puede ser numero o caracter especial'}
        } 
        const partidaBuscada = getPartidaById(req.params.id);

        if (partidaBuscada.vidas === 0) {
            manejadorMail.mandarMail(false,partidaBuscada);
            throw { status:400, descripcion: 'Perdiste, te quedan '+ partidaBuscada.vidas + ' vidas. La palabra en juego era ' + partidaBuscada.palabra}
        }
        esPartidaGanada(partidaBuscada)
        if (partidaBuscada.gano){
            manejadorMail.mandarMail(true, partidaBuscada)
            throw { status:400 , descripcion: 'No puede seguir jugando, pero tranquile, fue porque ganaste, FELICITACIONES'}
        }

        if (partidaBuscada.letrasArriesgadas.includes(letra)){
            throw { status:400, descripcion: 'La letra ' + letra + ' ya fue ingresada anteriormente'}
        } 

       
        partidaBuscada.letrasArriesgadas.push(letra);
        partidaBuscada.palabraOculta = verificarLetrasEnPalabra(partidaBuscada, letra);
        
        partidaAux = generarEstadoPartida(partidaBuscada);

        res.status(201).json(partidaAux)
    } catch (err) {
        res.status(err.status).json(err)
    } 
})

function generarEstadoPartida(partida){ 
    let partidaAMostrar = {};
    partidaAMostrar.id = partida.id;
    partidaAMostrar.vidas = partida.vidas;
    partidaAMostrar.palabraOculta = partida.palabraOculta;
    partidaAMostrar.letrasArriesgadas = partida.letrasArriesgadas;

    return partidaAMostrar;
}

function esPartidaInvalida(partida) {
    const esquema = {
        id: Joi.number().integer().min(0),
        mail: Joi.string().email().required(),
    }
    const { error } = Joi.validate(partida, esquema)
    return error
}


function esLetraInvalida(game){
    const esquema = {
        id: Joi.number().integer().min(0),
        letra: Joi.string().regex(/^[a-zA-Z]*$/).min(1).max(1).required()
    }
    const { error } = Joi.validate(game,esquema);
    return error;
}

function getAllPartidas() {
    return partidas
}

function getPartidaById(id) {
    return partidas.find(u => u.id == id)
}


function agregarPartida(partida , email) {
    partida.id = ultimoId + 1;
    partida.palabra = seleccionarPalabra();
    partida.palabraOculta = ocultarPalabra(partida.palabra);
    partida.mail = email;
    partida.vidas = 1;
    partida.letrasArriesgadas = [];
    partida.gano = false;
    partidas.push(partida)
    ultimoId++
}


function seleccionarPalabra(){
    let index = Math.floor(Math.random() * palabras.length);
    let palabra = palabras[index].toLowerCase();
    console.log("palabra " + palabra);
    return palabra;
}

function esPartidaGanada(partida){
    if(!partida.palabraOculta.includes("-")){
        partida.gano = true;
    }
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


const puerto = 5000;
app.listen(puerto, () => {
    console.log(`servidor inicializado en puerto ${puerto}`);
})
