const express = require('express')
const Joi = require('@hapi/joi')
const _ = require('lodash')

const app = express()

app.use(express.json())
app.set('json spaces', 4)

// base de datos

const usuarios = []
let ultimoId = 0

// rutas

//falta modificar algunos datos de la consulta para adaptarlo al BJ
app.get('/usuarios', (req, res) => {
    console.log('GETTING: ' + req.url)
    try {
        let result
        if (_.isEmpty(req.query)) {
            result = getAllUsuarios()
        } else if (req.query.hasOwnProperty('id')) {
            result = getUsuarioById(req.query.id);
        } else {
            throw { status: 400, descripcion: 'parametros de consulta invalidos' }
        }
        res.json(result)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.get('/usuarios/:id', (req, res) => {
    console.log('GETTING: ' + req.url)

    try {
        const usuarioBuscado = getUsuarioById(req.params.id)

        if (!usuarioBuscado) {
            throw { status: 404, descripcion: 'user no encontrado' }
        }
        res.json(usuarioBuscado)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.post('/usuarios', (req, res) => {
    console.log('POSTING: ' + req.url)

    const nuevoUser = req.body

    try {
        if (esUserInvalido(nuevoUser)) {
            throw { status: 400, descripcion: 'el user posee un formato json invalido o faltan datos' }
        }
        const usuarioBuscado = getUsuarioById(nuevoUser.id);
        const userNameExiste = getUsuarioByNombre(nuevoUser.nombre);
        const userMailExiste = getUsuarioByMail(nuevoUser.mail);

        if (usuarioBuscado) {
            throw { status: 400, descripcion: 'ya existe un user con ese id' }
        };
        if (userNameExiste){
            throw { status: 400, descripcion: 'ya existe un user con ese nombre' }
        };
        if (userMailExiste){
            throw { status: 400, descripcion: 'ya existe un user con ese mail' }
        }

        agregarUser(nuevoUser)

        res.status(201).json(nuevoUser)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

app.delete('/usuarios/:id', (req, res) => {
    console.log('DELETING: ' + req.url)

    try {
        eliminarUsuarioById(req.params.id)
        res.status(204), res.descripcion('El usuario fue elimnado')
    } catch (err) {
        res.status(err.status).json(err)
    }

})

app.put('/usuarios/:id', (req, res) => {
    console.log('REPLACING: ' + req.url)

    const nuevoUser = req.body;

    try {
        if (esUserInvalido(nuevoUser)) {
            throw { status: 400, descripcion: 'el usuario posee un formato json invalido o faltan datos' }
        }
        if (nuevoUser.id != req.params.id) {
            throw { status: 400, descripcion: 'no coinciden los ids enviados' }
        }
        reemplazarUsuarioById(nuevoUser)
        res.json(nuevoUser)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

function esUserInvalido(user) {
    const esquema = {
        id: Joi.number().integer().min(0),
        nombre: Joi.string().alphanum().min(1).required(),
        mail: Joi.string().email().required()
    }
    const { error } = Joi.validate(user, esquema);
    return error
}

// Operaciones con la base de datos

function getAllUsuarios() {
    return usuarios
}

function getUsuarioById(id) {
    return usuarios.find(u => u.id == id)
}

function getUsuarioByNombre(nombre){
    return usuarios.find(u => u.nombre == nombre)
}

function getUsuarioByMail(mail){
    return usuarios.find(u => u.mail == mail)
}

function agregarUser(user) {
    user.id = ultimoId + 1
    usuarios.push(user)
    ultimoId++
}

function eliminarUsuarioById(id) {
    const posBuscada = usuarios.findIndex(u => u.id == id)
    if (posBuscada != -1) {
        usuarios.splice(posBuscada, 1)
    } else {
        throw { status: 404, descripcion: 'user no encontrado' }
    }
}

function reemplazarUsuarioById(user) {
    const posBuscada = usuarios.findIndex(u => u.id == user.id)

    if (posBuscada == -1) {
        throw { status: 404, descripcion: 'user no encontrado' }
    }
    usuarios.splice(posBuscada, 1, user) 
    return user
}

const puerto = 5000;
app.listen(puerto, () => {
    console.log(`servidor inicializado en puerto ${puerto}`);
})
