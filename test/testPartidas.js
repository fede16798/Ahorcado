/* eslint-disable no-console */
const Joi = require('@hapi/joi')
const cli = require('./client')

let letraAux = '';
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

async function testPostConBody() {
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

async function testPostLetraConBody() {
 
    let result = false
    let letraTemporal = obtenerLetraAleatoria();
    letraAux = letraTemporal;
    try {
        let partida = await cli.arriesgarLetra({
            letra: letraTemporal,
        }, 1)
        
        validarPartida(partida)
        console.log("letra arriesgada")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function testArriesgarMismaLetra(){
    try {
        let partida = await cli.arriesgarLetra({
            letra: letraAux,
        }, 1)
        
        validarPartida(partida)
        console.log("letra arriesgada")
        result = true

    } catch (err) {
        if(err.statusCode == 403){
            console.log('PATCH a letra repetida: ok (era el error esperado)');
            result = true;
        } else {
            console.log(err.message)
        }
    }
    return result
}

async function testPostLetraConBodyAPartidaTerminada() {
 
    let result = false
    try {
        let partida = await cli.arriesgarLetra({
            letra: obtenerLetraAleatoria(),
        }, 1)
        
        validarPartida(partida)
        console.log("letra arriesgada")
        result = true
    } catch (err) {
        if(err.statusCode == 400){
            console.log('post a id terminado: ok (era el error esperado)');
            result = true;
        } else {
            console.log(err.message)
        }
    }
    return result
}

//ARRIESGAR UNA LETRA INVALIDA
async function testPostLetraInvalidaConBody() {
 
    let result = false
    try {
        let partida = await cli.arriesgarLetra({
            letra: obtenerLetraInvalidaAleatoria(),
        })
        
        validarPartida(partida)
        console.log("letra invalida arriesgada")
        result = true
    } catch (err) {
        if(err.statusCode == 400){
            console.log('post de letra invalido: ok (era el error esperado)');
            result = true;
        } else {
            console.log(err.message)
        }
    }
    return result
}

async function testPostSinBody() {
    let result = false
    try {
        const partida = await cli.crearPartida()
        console.log("post without body: error - no rechazó la petición!")
    } catch (err) {
        if (err.statusCode == 400) {
            console.log('post sin cuerpo: ok (era el error esperado)')
            result = true
        } else {
            console.log(err.message)
        }
    }
    return result
}

// async function testPostLetraAPartidaInvalida() {
 
//     let result = false
//     try {
//         let partida = await cli.arriesgarLetra({
//             letra: 'a',
//         }, 9)
        
//         validarPartida(partida)
//         console.log("letra a partida invalida arriesgada")
//         result = true
//     } catch (err) {
//             if (err.statusCode == 404) {
//                 console.log('Post a una partida inexistente: ok , era lo esperado')
//                 result = true
//             } else {
//                 console.log(err.message)
//             }
//         }
//     return result
// }

async function testGetAPartidaInexsistente() {
    let result = false

    try {
        await cli.buscarPorId(0)
        console.log("get by inexisting id: error - se encontró una partida inexistente")
    } catch (err) {
        if (err.statusCode == 404) {
            console.log("get a id inexistente: ok (era el error esperado)")
            result = true
        } else {
            console.log(err.message)
        }
    }
    return result
}

async function testGetAll(){
    result = false;
    try {
        await cli.buscarTodos()        
        console.log("get all: ok")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function main() {
    let exitos = 0;
   
    const tests = [
        testPostConBody,
        testGetAPartidaInexsistente,
        testPostLetraConBody,         
        testArriesgarMismaLetra,
        testPostLetraConBody,
        testPostLetraConBodyAPartidaTerminada,
        testPostSinBody, 
        testPostLetraInvalidaConBody,      
        testGetAll
    ]

    for (const test of tests) {
        exitos += (await test()) ? 1 : 0
    }

    console.log(`\nresultado de las pruebas: ${exitos}/${tests.length}`)
}

setTimeout(main, 2000)


//METODOS PARA OBTENER LETRAS 

function obtenerLetraAleatoria() {
    let str = '';
    const ref = 'xyzwqk';
    str += ref.charAt(Math.floor(Math.random()*ref.length));

    return str;
}

function obtenerLetraInvalidaAleatoria() {
    let str = '';
    const ref = '-[¨+` */!?';
    str += ref.charAt(Math.floor(Math.random()*ref.length));

    return str;
}