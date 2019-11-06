const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()

const baseURI = '/api/'

app.get('/', (req, res) => {
    console.log('GETTING: ' + req.url)
    try {
        console.log("Funciono")
    } catch (err) {
        res.status(err.status).json(err)
    }
})