/* eslint-disable no-console */
const Joi = require('@hapi/joi')
const cli = require('./client')


let letraAux = ''; //esta variable sirve para que despues se pueda postear una letra repetida 
let numParaSaberQueLetraArriesgar = 1; //esta variable sirve para que se modifique automaticamente a que letra arriesgar en la partida ganadora

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

        //GENERA UNA PARTIDA PARA PERDER
async function testPostConBody() {
    let result = false
    try {
        const partida = await cli.crearPartida({
            mail: 'oficiosmail@gmail.com',
        })
        validarPartida(partida)
        console.log("POST partida para perder")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

        //ARRIESGA UNA LETRA
async function testPatchLetraConBody() {
 
    let result = false
    let letraTemporal = obtenerLetraAleatoria();
    letraAux = letraTemporal;
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letraTemporal,
        }, 1)
        
        validarPartida(partida)
        console.log("PATCH de una letra a una partida para perder")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

async function testPatchZConBody() {
 
    let result = false
    let letraTemporal = "Z";
    letraAux = letraTemporal;
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letraTemporal,
        }, 1)
        
        validarPartida(partida)
        console.log("PATCH de una letra a una partida para perder")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

        //ARRIESGA UNA LETRA QUE YA FUE INGRESADA ANTERIORMENTE
async function testArriesgarMismaLetra(){
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letraAux,
        }, 1)
        
        validarPartida(partida)
        console.log("Post de una letra ")
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
        //ARRIESGA UNA LETRA A UNA PARTIDA TERMINADA
async function testPatchLetraConBodyAPartidaTerminada() {
 
    let result = false
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
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
async function testPatchLetraInvalidaConBody() {
 
    let result = false
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
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

        //ARRIESGA UNA LETRA CON EL BODY VACIO
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

        //SE HACE UN GET A UNA PARTIDA QUE NO EXISTE
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

        //SE HACE UN GET DE TODAS LAS PARTIDAS ACTIVAS
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

        //SE CREA UNA PARTIDA PARA GANAR
async function testPostPartidaParaGanar(){
    let result = false
    try {
        const partida = await cli.crearPartida({
            mail: 'oficiosmail@gmail.com',
        })
        validarPartida(partida)
        console.log("Se crea una partida para ganar")
        result = true
    } catch (err) {
        console.log(err.message)
    }
    return result
}

        //ARRIESGA LETRAS A LA PARTIDA GANADORA
async function testPatchLetraConBodyParaGanar() {
    let num = numParaSaberQueLetraArriesgar;
    numParaSaberQueLetraArriesgar++;
    let result = false
    let letraTemporal = obtenerLetraAleatoriaGanadora(num);
    try {
            let partida = await cli.arriesgarLetraEnPartidaGanadora({
                letra: letraTemporal,
            }, 2)

        validarPartida(partida)
        console.log("PATCH letra a una partida para ganar. El post es en la posición " + num + ' de la palabra')
        result = true
    } catch (err) {
        if(err.statusCode == 400){
            console.log('post a id terminado: ok (era el error esperado)');
            result = true;
        }
        console.log(err.message)
    }
    return result
}


async function main() {
    let exitos = 0;
       
    const tests = [
        testPostConBody,
        testGetAPartidaInexsistente,
        testPatchLetraConBody,         
        testArriesgarMismaLetra,
        testPatchZConBody,
        testPatchLetraConBodyAPartidaTerminada,
        testPostSinBody, 
        testPatchLetraInvalidaConBody,      
        testGetAll,
        testPostPartidaParaGanar,
        testPatchLetraConBodyParaGanar,
        testPatchLetraConBodyParaGanar,
        testPatchLetraConBodyParaGanar,
        testPatchLetraConBodyParaGanar,//en esta linea se gana la partida numero 2
        testPatchLetraConBodyParaGanar //en esta linea se manda el mail en la partida numero 2
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
    const ref = 'xywq';
    str += ref.charAt(Math.floor(Math.random()*ref.length));
    return str;
}

function obtenerLetraAleatoriaGanadora(num) {
    switch (num) {
        case 1: str = 'm'
            break;
        case 2: str = 'o'
            break;
        case 3: str = 'c'
            break;
        case 4: str = 'k'
            break;
        default:
            str = 'a'
            break;
    }
    
    return str;
}

function obtenerLetraInvalidaAleatoria() {
    let str = '';
    const ref = '-[¨+` */!?';
    str += ref.charAt(Math.floor(Math.random()*ref.length));

    return str;
}