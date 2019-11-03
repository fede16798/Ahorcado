const express = require('express')
const Joi = require('@hapi/joi')
const _ = require('lodash')

const app = express()

app.use(express.json())
app.set('json spaces', 4)

// base de datos

const partidas = []
let ultimoId = 0

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
            throw { status: 404, descripcion: 'user no encontrado' }
        }
        res.json({partidaBuscada, 
            palabra: "hola",
            vidas: 2/5})
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.post('/iniciarPartida', (req, res) => {
    console.log('POSTING: ' + req.url)

    const nuevaPartida = req.body

    try {
        if (esPartidaInvalida(nuevaPartida)) {
            throw { status: 400, descripcion: 'el user posee un formato json invalido o faltan datos' }
        }
        const partidaBuscada = getPartidaById(nuevaPartida.id);
        const userMailExiste = getPartidaByMail(nuevaPartida.mail);

        if (partidaBuscada) {
            throw { status: 400, descripcion: 'ya existe un user con ese id' }
        };
        if (userMailExiste){
            throw { status: 400, descripcion: 'ya existe un user con ese mail' }
        }

        agregarPartida(nuevaPartida)

        res.status(201).json(nuevaPartida)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.post('/arriesgarLetra/:id', (req, res) => {
    console.log('POSTING: arriesgando letra en la partida ' + req.url);

    
    const letra = req.body;

    try {
         if (!esLetraRegular(letra)){
            throw { status: 400, descripcion: 'La letra ingresada no puede ser numero o caracter especial'}
        }

        const partidaBuscada = getPartidaById(partida.id);
        
        partidaBuscada.letras.push(letra);
        
        res.status(201).json(letra)
    } catch (err) {
        res.status(err.status).json(err)
    } 
})

function esPartidaInvalida(user) {
    const esquema = {
        id: Joi.number().integer().min(0),
        mail: Joi.string().email().required(),
    }
    const { error } = Joi.validate(user, esquema);
    return error
}

function esLetraRegular(letra){
    let regEx = new RegExp("^[a-zA-Z\s]{1,1}$");
    return regEx.test(letra);
}

// function esLetraInvalida(game){
//     const esquema = {
//         id: Joi.number().integer().min(0),
//         lett: Joi.Joi.string().required()
//     }
//     const { error } = Joi.validate(game,esquema);
//     return error;
// }


function getAllPartidas() {
    return partidas
}

function getPartidaById(id) {
    return partidas.find(u => u.id == id)
}


function getPartidaByMail(mail){
    return partidas.find(u => u.mail == mail)
}

function agregarPartida(user) {
    user.id = ultimoId + 1
    partidas.push(user)
    ultimoId++
}

// function eliminarUsuarioById(id) {
//     const posBuscada = partidas.findIndex(u => u.id == id)
//     if (posBuscada != -1) {
//         partidas.splice(posBuscada, 1)
//     } else {
//         throw { status: 404, descripcion: 'user no encontrado' }
//     }
// }


const puerto = 5000;
app.listen(puerto, () => {
    console.log(`servidor inicializado en puerto ${puerto}`);
})
