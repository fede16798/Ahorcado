const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()

const baseURI = '/api/palabra'

router.get('/', (req, res) => {
    console.log('GETTING: ' + baseURI + req.url)
    try {
        res.json("Aca te muestra una palabra" );
    } catch (err) {
        res.status(err.status).json(err)
    }
})


module.exports = router