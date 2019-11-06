const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()

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


module.exports = router