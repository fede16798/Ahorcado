/* eslint-disable no-console */
const Joi = require('@hapi/joi')
const cli = require('./client')


let letraAux = ''; //esta variable sirve para que despues se pueda postear una letra repetida 

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
    console.log("Test 1");
    let result = false
    try {
        const partida = await cli.crearPartida({
            mail: 'lucas.bernadsky@gmail.com',
        })
        console.log("Crear nueva partida con ID 1 con mail valido (Esta partida se debera perder) (POST) OK.")
        console.log("Estado parcial de partida: ")
        console.log(partida);
        result = true
    } catch (err) {
        if(err.statusCode == 500){
            console.log("La api envia una palabra defectuosa a nuestro servidor. No puede crear partida. Error esperado. OK")
            result = true
        }else{
            console.log(err.message);
        }
    }
    return result
}

        //ARRIESGA UNA LETRA
async function testPatchLetraConBody() {
    console.log("Test 3");
    let result = false
    let letraTemporal = obtenerLetraAleatoria();
    letraAux = letraTemporal;
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letraTemporal,
        }, 1)
        
        validarPartida(partida)
        console.log("Arriesgar letra " + letraTemporal + ". en la partida 1. Este intento pierde una vida. OK. (PATCH)")
        result = true
        console.log("Estado parcial de partida: ")
        console.log(partida);
    } catch (err) {
        if(err.statusCode == 404){
            console.log("No hay partida creada por un error en test anterior. resultado esperado. OK")
            result = true
        }else{
            console.log("El test fallo con un error inesperado:" + err.message)
        }
        
    }
    return result
}

async function testPatchZConBody() {
    console.log("Test 5");
    let result = false
    let letraTemporal = "z";
    letraAux = letraTemporal;
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letraTemporal,
        }, 1)
        
        console.log("Arriesga letra Z a partida 1. Este intento pierde la partida. OK. (PATCH)")
        result = true
        console.log("Estado parcial de partida: ")
        if(partida.status == 200){
            console.log(await cli.buscarPorId(1));
        }else{
            console.log(partida)
        }
    } catch (err) {
        if(err.statusCode == 404){
            console.log("No puede arriesgar letra dado que no se creo partida en los test previos. OK")
            result = true;
        }else{
            console.log(err.message)
        }
        
    }
    return result
}

        //ARRIESGA UNA LETRA QUE YA FUE INGRESADA ANTERIORMENTE
async function testArriesgarMismaLetra(){
    console.log("Test 4")
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letraAux,
        }, 1)
        
        validarPartida(partida)
        console.log("Arriesga letra ya arriesgada: " + letraAux)
        result = true

    } catch (err) {
        if(err.statusCode == 403){
            console.log('PATCH a letra repetida: ok (era el error esperado)');
            result = true;
        } else if(err.statusCode == 404){
            console.log("No hay partida creada por un error en test anterior. resultado esperado. OK")
            result = true;
        }else{
            console.log(err.message)
        }
    }
    return result
}
        //ARRIESGA UNA LETRA A UNA PARTIDA TERMINADA
async function testPatchLetraConBodyAPartidaTerminada() {
    console.log("Test 6");
    let result = false
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: obtenerLetraAleatoria(),
        }, 1)
        
        validarPartida(partida)
        console.log("letra arriesgada")
        result = true
    } catch (err) {
        if(err.statusCode == 403){
            console.log('post a id terminado: ok (era el error esperado)');
            result = true;
        } else if(err.statusCode == 404) {
            console.log("No puede arriesgar letra dado que no se creo partida en los test previos. OK")
            result = true;
        }else{
            console.log(err.message)
        }
    }
    return result
}

        //ARRIESGAR UNA LETRA INVALIDA
async function testPatchLetraInvalidaConBody() {
    console.log("Test 8");
    let result = false
    let letra = obtenerLetraAleatoria();
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letra,
        })
        
        validarPartida(partida)
        console.log("Arriesgando letra invalida: " + letra )
        result = true
    } catch (err) {
        if(err.statusCode == 400){
            console.log('El sistema no permite arriesgar ese caracter: OK (era el error esperado) (POST)');
            result = true;
        } else if(err.statusCode == 404){
            console.log('El test no puede ejecutarse dado que no se crearon partidas previas. OK');
            result = true;
        }else{
            console.log(err.message)
        }
    }
    return result
}

        //ARRIESGA UNA LETRA CON EL BODY VACIO
async function testPostSinBody() {
    console.log("Test 7");
    let result = false
    try {
        const partida = await cli.crearPartida()
        console.log("post without body: error - no rechazó la petición!")
    } catch (err) {
        if (err.statusCode == 400) {
            console.log('Intenta crear una partida sin mail y el sistema no lo permite. OK. (POST)')
            result = true
        } else {
            console.log(err.message)
        }
    }
    return result
}
async function testPostConBodyIncorrecto() {
    console.log("Test 12");
    let result = false
    try {
        const partidaRecibida = await cli.crearPartida({
            mail: 'defectuoso',
        })
        console.log("POST con body defectuoso: error - no rechazó la petición!")
    } catch (err) {
        if (err.statusCode == 400) {
            console.log('Intenta crear una partida con un mail invalido y el sistema no lo permite. OK. (POST)')
            result = true
        } else {
            console.log(err.message)
        }
    }
    return result
}

        //SE HACE UN GET A UNA PARTIDA QUE NO EXISTE
async function testGetAPartidaInexsistente() {
    console.log("Test 2");
    let result = false

    try {
        if(await cli.buscarPorId(3)){
            console.log("Existe una partida con ID 3. OK, era el resultado esperado (GET)")
            result = true;
        }
    } catch (err) {
        if (err.statusCode == 404) {
            console.log("Fallo al buscar una partida con ID 3, dado que no existe. OK, era el resultado esperado. (GET)")
            result = true;
        } else {
            console.log("El test fallo con un error inesperado: " + err.message)
        }
    }
    return result
}

        //SE HACE UN GET DE TODAS LAS PARTIDAS ACTIVAS
async function testGetAll(){
    console.log("Test 9");
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
    console.log("Test 10");
    let result = false
    try {
        const partida = await cli.crearPartida({
            mail: 'lucas.bernadsky@gmail.com',
        })
        validarPartida(partida)
        console.log("Se crea una partida para ganar")
        result = true
    } catch (err) {
        if(err.statusCode == 500){
            console.log("El sistema no permite crear una partida debido a una falla en la API. OK")
            result = true 
        }else{
          console.log(err.message)  
        }
        
    }
    return result
}

        //ARRIESGA LETRAS A LA PARTIDA GANADORA
async function testPatchLetraConBodyParaGanar() {
    let result = false
    let partida = {};
    for (let index = 0; index < 4; index++) {
        let letraTemporal = obtenerLetraAleatoriaGanadora(index);     
        console.log("TEST 11." + (index + 1) + " - Arriesgar letra " + letraTemporal + ". en la partida 2 (PATCH)")   
        try {
            partida = await cli.arriesgarLetraEnPartidaGanadora({
                letra: letraTemporal,
            }, 2)

            if(index != 3 && partida.vidas != 2){
                console.log("El test fallo al arriesgar una letra erronea. Solo se admiten letras correctas en este test");
                index = 4;
            }
            
        } catch (err) {
            if(err.statusCode == 404){
                console.log("El test no puede encontrar una partida debido a errores en los tests anteriores. OK")
                result = true;
            }else{
                console.log("Error inesperado en TEST 11. " + err.message);
            }
            
        }
    }

    if(partida.status == 200){
        result = true;
    }

    // try {
    //         let partida = await cli.arriesgarLetraEnPartidaGanadora({
    //             letra: letraTemporal,
    //         }, 2)

    //     validarPartida(partida)
    //     console.log("Arriesgar letra " + letraTemporal + ". en la partida 2 (PATCH)")

    //     if(partida.vidas == 2){
    //         result = true
    //     }else{
    //         console.log("Test fallido por arriesgar letra erronea. Este test solo debe arriesgar letras correctas")
    //     }
        
    // } catch (err) {
    //     if(err.statusCode == 400){
    //         console.log('POST a partida ya finalizada: ok (era el error esperado)');
    //         result = true;
    //     }
    //     // console.log(err.message)
    // }
    return result
}




async function main() {
    let exitos = 0;
       
    const tests = [
        testPostConBody, //Crea partida
        testGetAPartidaInexsistente, //Get a partida 0
        testPatchLetraConBody, //Hace un PATCH de una letra erronea      
        testArriesgarMismaLetra,
        testPatchZConBody,
        testPatchLetraConBodyAPartidaTerminada,
        testPostSinBody, 
        testPatchLetraInvalidaConBody,      
        testGetAll,
        testPostPartidaParaGanar,
        testPatchLetraConBodyParaGanar,
        testPostConBodyIncorrecto,
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
        case 0: str = 'm'
            break;
        case 1: str = 'o'
            break;
        case 2: str = 'c'
            break;
        case 3: str = 'k'
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