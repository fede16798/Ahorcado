const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()
const partida = require('../Partida/partida')

const baseURI = '/api/partida'

router.get('/', (req, res) => {
    console.log('GETTING: ' + baseURI + req.url)
    try {
        res.json("funciono partida")
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.get('/palabra', (req, res) => {
    console.log('GETTING: ' + baseURI + req.url)
    try {
        res.json("Tu palabra es Auto")
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.post('/', (req, res) => {
    console.log('POSTING: ' + req.url)

    const nuevaPartida = req.body

    try {
        if (esPartidaInvalida(nuevaPartida)) {
            throw { status: 400, descripcion: 'el partida posee un formato json invalido o faltan datos' }
        }
        const partidaBuscada = partida.getPartidaById(nuevaPartida.id);

        if (partidaBuscada) {
            throw { status: 400, descripcion: 'ya existe un partida con ese id' }
        }; 
        

        partida.agregarPartida(nuevaPartida, req.body.mail);

        partidaAux = partida.generarEstadoPartida(nuevaPartida);
        res.status(201).json(partidaAux);

    } catch (err) {
        console.log(err)
        res.status(err.status).json(err);
    }
})

function esPartidaInvalida(partida) {
    const esquema = {
        id: Joi.number().integer().min(0),
        mail: Joi.string().email().required(),
    }
    const { error } = Joi.validate(partida, esquema)
    return error
}


module.exports = router