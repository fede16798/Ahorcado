const express = require('express')
const Joi = require('@hapi/joi')
const _ = require('lodash')

const app = express()

app.use(express.json())
app.set('json spaces', 4)

// base de datos

const partidas = []
let ultimoId = 0
const palabras= ["auto" , "moto" , "cuatriciclo" , "monopatin"];

app.get('/partidas', (req, res) => {
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

app.get('/partidas/:id', (req, res) => {
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

app.post('/iniciarPartida', (req, res) => {
    console.log('POSTING: ' + req.url)

    const nuevaPartida = req.body

    try {
        if (esPartidaInvalida(nuevaPartida)) {
            throw { status: 400, descripcion: 'el partida posee un formato json invalido o faltan datos' }
        }
        const partidaBuscada = getPartidaById(nuevaPartida.id);
        const partidaMailExiste = getPartidaByMail(nuevaPartida.mail);

        if (partidaBuscada) {
            throw { status: 400, descripcion: 'ya existe un partida con ese id' }
        }; 
        

        agregarPartida(nuevaPartida, req.body.mail);

        res.status(201).json(nuevaPartida)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.post('/arriesgarLetra/:id', (req, res) => {
    console.log('POSTING: arriesgando letra en la partida ' + req.url);

    const letra = req.body.letra;
    try {
         if (esLetraInvalida(req.body)){
            throw { status: 400, descripcion: 'La letra ingresada no puede ser numero o caracter especial'}
        }

        const partidaBuscada = getPartidaById(req.params.id);

        partidaBuscada.letrasArriesgadas.push(letra);
        partidaBuscada.palabraOculta = verificarLetrasEnPalabra(partidaBuscada.palabra, partidaBuscada.palabraOculta, letra);
        
        res.status(201).json(letra)
    } catch (err) {
        res.status(err.status).json(err)
    } 
})

function esPartidaInvalida(partida) {
    const esquema = {
        id: Joi.number().integer().min(0),
        mail: Joi.string().email().required(),
    }
    const { error } = Joi.validate(partida, esquema);
    return error
}

function verificarLetrasEnPalabra (palabra, palabraOculta, letra) {
    console.log("Arranca funcion de verificar");
    palabra = palabra.toLowerCase();
    letra = letra.toLowerCase();
    let nuevaPalabraOculta = new String (palabraOculta)
    for (let index = 0; index < palabra.length; index++) {
        if (palabra[index] === letra) {
            console.log("letra acertada ");
            palabraOculta.replaceAt(index , letra)
           // palabraOculta.charAt(index) = letra;
            console.log(palabraOculta);
        } else { 
            console.log("la letra es erronea");
        }
    }
    return palabraOculta;
}

// function esLetraRegular(letra){
//     let regEx = new RegExp("^[a-zA-Z\s]{1,1}$");
//     return regEx.test(letra);
// }

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

function getPartidaByMail(mail){
    return partidas.find(u => u.mail == mail)
}

function agregarPartida(partida , email) {
    partida.id = ultimoId + 1;
    partida.palabra = "auto";
    partida.palabraOculta = ocultarPalabra(partida.palabra);
    partida.mail = email;
    partida.vidas = 3;
    partida.letrasArriesgadas = [];
    partidas.push(partida)
    ultimoId++
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

function seleccionarPalabra(){
    let index = Math.floor(Math.random() * palabras.length);
    let palabra = palabras[index].toLowerCase;
    console.log("palabra " + palabra);
    return palabra;
}
const puerto = 5000;
app.listen(puerto, () => {
    console.log(`servidor inicializado en puerto ${puerto}`);
})
