const express = require('express')
const Joi = require('@hapi/joi')
const _ = require('lodash')

const app = express()

app.use(express.json())
app.set('json spaces', 4)

// base de datos

const partidas = []
let ultimoId = 0

// rutas

//falta modificar algunos datos de la consulta para adaptarlo al BJ
app.get('/partidas', (req, res) => {
    console.log('GETTING: ' + req.url)
    try {
        let result
        if (_.isEmpty(req.query)) {
            result = getAllpartidas()
        } else if (req.query.hasOwnProperty('id')) {
            result = gerPartidaById(req.query.id);
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
        const partidaBuscada = gerPartidaById(req.params.id)

        if (!partidaBuscada) {
            throw { status: 404, descripcion: 'partida no encontrado' }
        }
        res.json(partidaBuscada)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

//Metodo get para pedir el resultado parcial de la partida
app.get('/partidas/jugar/:id', (req, res) => {
    console.log('GETTING: ' + req.url)

    try {
        const partidaBuscada = gerPartidaById(req.params.id)

        if (!partidaBuscada) {
            throw { status: 404, descripcion: 'partida no encontrado' }
        }
        res.json(partidaBuscada)
    } catch (err) {
        res.status(err.status).json(err)
    }
})


app.post('/partidas', (req, res) => {
    console.log('POSTING: ' + req.url)

    const nuevaPartida = req.body

    try {
        if (esPartidaInvalida(nuevaPartida)) {
            throw { status: 400, descripcion: 'el partida posee un formato json invalido o faltan datos' }
        }
        const partidaBuscada = gerPartidaById(nuevaPartida.id);
       // const partidaNameExiste = getUsuarioByNombre(nuevaPartida.nombre);
        const partidaMailExiste = getUsuarioByMail(nuevaPartida.mail);

        if (partidaBuscada) {
            throw { status: 400, descripcion: 'ya existe una partida con ese id' }
        };
        // if (partidaNameExiste){
        //     throw { status: 400, descripcion: 'ya existe un partida con ese nombre' }
        // };
        if (partidaMailExiste){
            throw { status: 400, descripcion: 'ya existe una partida con ese mail' }
        }

        agregarPartida(nuevaPartida)

        res.status(201).json(nuevaPartida)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.delete('/partidas/:id', (req, res) => {
    console.log('DELETING: ' + req.url)

    try {
        eliminarPartidaById(req.params.id)
        res.status(204), res.descripcion('La partida fue terminada')
    } catch (err) {
        res.status(err.status).json(err)
    }

})

app.put('/partidas/:id', (req, res) => {
    console.log('REPLACING: ' + req.url)

    const nuevaPartida = req.body;

    try {
        if (esPartidaInvalida(nuevaPartida)) {
            throw { status: 400, descripcion: 'el usuario posee un formato json invalido o faltan datos' }
        }
        if (nuevaPartida.id != req.params.id) {
            throw { status: 400, descripcion: 'no coinciden los ids enviados' }
        }
        reemplazarPartidaById(nuevaPartida)
        res.json(nuevaPartida)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

function esPartidaInvalida(partida) {
    const esquema = {
        id: Joi.number().integer().min(0),
       // nombre: Joi.string().alphanum().min(1).required(),
        mail: Joi.string().email().required()
    }
    const { error } = Joi.validate(partida, esquema);
    return error
}

// Operaciones con la base de datos

function getAllpartidas() {
    return partidas
}

function gerPartidaById(id) {
    return partidas.find(u => u.id == id)
}

// function getUsuarioByNombre(nombre){
//     return partidas.find(u => u.nombre == nombre)
// }

function getUsuarioByMail(mail){
    return partidas.find(u => u.mail == mail)
}

function agregarPartida(partida) {
    partida.id = ultimoId + 1
    partidas.push(partida)
    ultimoId++
}

function eliminarPartidaById(id) {
    const posBuscada = partidas.findIndex(u => u.id == id)
    if (posBuscada != -1) {
        partidas.splice(posBuscada, 1)
    } else {
        throw { status: 404, descripcion: 'partida no encontrado' }
    }
}

function reemplazarPartidaById(partida) {
    const posBuscada = partidas.findIndex(u => u.id == partida.id)

    if (posBuscada == -1) {
        throw { status: 404, descripcion: 'partida no encontrado' }
    }
    partidas.splice(posBuscada, 1, partida) 
    return partida
}

const puerto = 4000;
app.listen(puerto, () => {
    console.log(`servidor inicializado en puerto ${puerto}`);
})
