/* eslint-disable no-console */
const Joi = require('@hapi/joi')
const cli = require('./client')
//VALIDACIONES

function validarPartida(partida) {
    const partidaSchema = {
        id: Joi.number().integer().min(0),
        vidas: Joi.number().integer().min(0),
        palabraOculta: Joi.string().min(1),
        letrasArriesgadas: Joi.array().items(Joi.string()) 
    }
    const { error } = Joi.validate(partida, partidaSchema)
    if (error) {
        throw error
    }
}

// TESTS

async function testPostWithBody() {
    let result = false
    try {
        const partida = await cli.crearPartida({
            mail: 'sebycerda@hotmail.com',
        })
        validarPartida(partida)
        console.log("partida creada")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function testPostLetraWithBody() {
 
    let result = false
    try {
        let partida = await cli.arriesgarLetra({
            letra: obtenerLetraAleatoria(),
        })
        
        validarPartida(partida)
        console.log("letra arriesgada")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function testPostWithoutBody() {
    let result = false
    try {
        const partida = await cli.crearPartida()
        console.log("post without body: error - no rechazó la petición!")
    } catch (err) {
        if (err.statusCode == 400) {
            console.log('post without body: ok (with expected error)')
            result = true
        } else {
            console.log(err.message)
        }
    }
    return result
}

async function main() {
    let exitos = 0;
   
    const tests = [
        testPostWithBody,
        testPostLetraWithBody,
        testPostLetraWithBody,
        testPostWithoutBody,
    ]

    for (const test of tests) {
        exitos += (await test()) ? 1 : 0
    }

    console.log(`\nresultado de las pruebas: ${exitos}/${tests.length}`)
}
setTimeout(main, 2000)

function obtenerLetraAleatoria() {
    let str = '';
    const ref = 'xyzwqk';
    str += ref.charAt(Math.floor(Math.random()*ref.length));

    return str;
}