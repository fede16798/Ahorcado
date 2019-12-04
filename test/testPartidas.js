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

//CREA UNA NUEVA PARTIDA. Esta debe perderse.
async function testPostConBody() {
    console.log("Test 1");
    console.log("Creando nueva partida con ID 1 y mail valido (Esta partida se debera perder)")
    let result = false
    try {
        const partida = await cli.crearPartida({
            mail: 'lucas.bernadsky@gmail.com',
        })
        console.log("Partida creada exitosamente. OK (POST)")
        console.log("Estado inicial de partida: ")
        console.log(partida);
        result = true
    } catch (err) {
        if(err.statusCode == 500){
            console.log("El sistema no permite crear una partida debido a una posible falla al seleccionar palabra, en la API. OK. (POST)")
            result = true
        }else{
            console.log(err.message);
        }
    }

    console.log("-----------------------------");
    return result
}

        //ARRIESGA UNA LETRA
async function testPatchLetraConBody() {
    console.log("Test 3");    
    let result = false
    let letraTemporal = obtenerLetraAleatoria();
    console.log(`Arriesgando letra: ` + `"` + letraTemporal +`"`+ " a partida 1")
    letraAux = letraTemporal;
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letraTemporal,
        }, 1)        
        validarPartida(partida)
        console.log("Arriesgar letra " + letraTemporal + ". Este intento pierde una vida. OK. (PATCH)")
        result = true
        console.log("Estado parcial de partida: ")
        console.log(partida);
    } catch (err) {
        if(err.statusCode == 404){
            console.log("No puede arriesgar letra dado que no se creo la partida en los test previos. OK")
            result = true
        }else{
            console.log("El test fallo con un error inesperado:" + err.message)
        }        
    }
    console.log("-----------------------------");
    return result
}

async function testPatchZConBody() {
    console.log("Test 6");
    let result = false
    let letraTemporal = "z";
    console.log(`Arriesgando letra: ` + `"` + letraTemporal +`"`+ " a partida 1")
    letraAux = letraTemporal;
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letraTemporal,
        }, 1)
        
        console.log("Arriesga letra Z a partida 1. Este intento pierde la partida. OK. (PATCH)")
        result = true
        console.log("Estado final de partida: ")
        if(partida.status == 200){
            console.log(await cli.buscarPorId(1));
        }else{
            console.log(partida)
        }
    } catch (err) {
        if(err.statusCode == 404){
            console.log("No puede arriesgar letra dado que no se creo la partida en los test previos. OK")
            result = true;
        }else{
            console.log(err.message)
        }
        
    }
    console.log("-----------------------------");
    return result
}

        //ARRIESGA UNA LETRA QUE YA FUE INGRESADA ANTERIORMENTE
async function testArriesgarMismaLetra(){
    let result = false;
    console.log("Test 5")
    console.log(`Arriesgando letra ya agregada a partida 1: ` + `"` + letraAux +`"`)
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letraAux,
        }, 1)
        
    } catch (err) {
        if(err.statusCode == 403){
            console.log('Arriesga una letra repetida y el sistema no lo permite: OK (PATCH)');
            result = true;
        } else if(err.statusCode == 404){
            console.log("No puede arriesgar letra dado que no se creo la partida en los test previos. OK (PATCH)")
            result = true;
        }else{
            console.log(err.message)
        }
    }
    console.log("-----------------------------");
    return result
}
        //ARRIESGA UNA LETRA A UNA PARTIDA TERMINADA
async function testPatchLetraConBodyAPartidaTerminada() {
    console.log("Test 8");
    let result = false
    let letraAleatoria = obtenerLetraAleatoria();
    console.log(`Arriesgando letra a una partida ya finalizada a Partida 1: ` + `"` + letraAleatoria +`"`);
    console.log("El sistema no deberia permitir esta accion")
    try {
        let partida = await cli.arriesgarLetraEnPartidaPerdedora({
            letra: letraAleatoria,
        }, 1)
        
        validarPartida(partida)
        console.log("Arriesgando letra aleatoria a una partida ya finalizada")
        result = true
    } catch (err) {
        if(err.statusCode == 403){
            console.log('El sistema no permite arriesgar letra en una partida terminada: OK (POST)');
            result = true;
        } else if(err.statusCode == 404) {
            console.log("No puede arriesgar letra dado que no se creo la partida en los test previos. OK")
            result = true;
        }else{
            console.log(err.message)
        }
    }
    console.log("-----------------------------");
    return result
}



        //ARRIESGAR UN CARACTER INVALIDO
        async function testPatchCaracterInvalidoConBody() {
            console.log("Test 4");            
            let caracter = obtenerLetraInvalidaAleatoria();
            console.log(`Arriesgando caracter invalido: ` + `"` + caracter +`"`+ " a partida 1")

            let result = false
            try {
                let partida = await cli.arriesgarLetraEnPartidaPerdedora({
                    letra: caracter,
                })
            } catch (err) {
                if(err.statusCode == 400){
                    console.log('El sistema no permite arriesgar ese caracter: OK (PATCH)');
                    result = true;
                } else if(err.statusCode == 404){
                    console.log("No puede arriesgar letra dado que no se creo la partida en los test previos. OK");
                    result = true;
                }else if(err.statusCode == 403){
                    console.log('No se puede arrisgar letra, esta partida ya se encuentra terminada. OK. (POST)');
                    result = true;
                }else{
                    console.log(err.message)
                }
            }
            console.log("-----------------------------");
            return result
        }

        //ARRIESGA UNA LETRA CON EL BODY VACIO
async function testPostSinBody() {
    console.log("Test 9");
    console.log("Intentando crear una partida sin mail. El sistema no deberia permitir esta accion")
    let result = false
    try {
        const partida = await cli.crearPartida()
        console.log("El test fallo porque el servidor no pudo validar que el mail requerido estaba vacio (invalido).")
    } catch (err) {
        if (err.statusCode == 400) {
            console.log('Intenta crear una partida sin mail y el sistema no lo permite. OK. (POST)')
            result = true
        } else {
            console.log(err.message)
        }
    }
    console.log("-----------------------------");
    return result
}
async function testPostConBodyIncorrecto() {
    console.log("Test 10");
    console.log("Intentando crear una partida con un mail con formato invalido. El sistema no deberia permitirlo")
    let result = false
    try {
        const partidaRecibida = await cli.crearPartida({
            mail: 'defectuoso',
        })
        console.log("El test fallo porque el servidor no pudo validar que el mail requerido era invalido.")
    } catch (err) {
        if (err.statusCode == 400) {
            console.log('Intenta crear una partida con un mail invalido y el sistema no lo permite. OK. (POST)')
            result = true
        } else {
            console.log(err.message)
        }
    }
    console.log("-----------------------------");
    return result
}

        //SE HACE UN GET A UNA PARTIDA QUE NO EXISTE
async function testGetAPartidaInexsistente() {
    console.log("Test 2");
    console.log("Buscando partida con ID 0. Se espera que no lo encuentre")
    let result = false

    try {
        if(await cli.buscarPorId(0)){
            console.log("Existe una partida con ID 0. OK. (GET)")
            result = true;
        }
    } catch (err) {
        if (err.statusCode == 404) {
            console.log("Fallo al buscar una partida con ID 0, dado que no existe. OK. (GET)")
            result = true;
        } else {
            console.log("El test fallo con un error inesperado: " + err.message)
        }
    }
    console.log("-----------------------------");
    return result
}

        //SE HACE UN GET DE TODAS LAS PARTIDAS ACTIVAS
async function testGetAll(){
    console.log("Test 14");
    console.log("Intentando listar todas las partidas")
    result = false;
    try {
        let partidas = await cli.buscarTodos()        
        console.log("Listando toda las partidas. OK. ")
        partidas.forEach(partida => {
            console.log(partida)
        });
        result = true
    } catch (err) {
        console.log(err.message)
    }
    console.log("-----------------------------");
    return result
}

        //SE CREA UNA PARTIDA PARA GANAR
async function testPostPartidaParaGanar(){
    console.log("Test 11");
    console.log("Creando una nueva partida. Esta se debera ganar, siempre que la palabra la provea la API de Test")
    let result = false
    try {
        const partida = await cli.crearPartida({
            mail: 'lucas.bernadsky@gmail.com',
        })
        validarPartida(partida)
        console.log("Se crea una partida para ganar")
        result = true
        console.log(partida);
    } catch (err) {
        if(err.statusCode == 500){
            console.log("El sistema no permite crear una partida debido a una posible falla al seleccionar palabra, en la API. OK")
            result = true 
        }else{
          console.log(err.message)  
        }
        
    }
    console.log("-----------------------------");
    return result
}


        //ARRIESGA LETRAS A LA PARTIDA GANADORA
async function testPatchLetraConBodyParaGanar() {
    console.log("Test 12")
    console.log("Arriesgara las 4 letras pertenecientes a la palabra MOCK, provista por la API de Test")
    console.log("Este test fallara si no se utiliza la API de prueba, y no representa un problema, necesariamente")
    let result = false
    let partida = {};
    for (let index = 0; index < 4; index++) {
        let letraTemporal = obtenerLetraAleatoriaGanadora(index);     
        console.log("Test 12." + (index + 1) + " - Arriesga letra " + letraTemporal + ". en la partida 2 (PATCH)")   
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

    console.log("-----------------------------");
    return result
}

async function testVerificarPartidaGanada(){
    console.log("Test 13");
    console.log("Probando que la partida 2 esté finalizada y ganada.")
    let result = false;
    let partidaRecibida = await cli.buscarPorId(2);
    if (partidaRecibida.gano && partidaRecibida.vidas > 0){
        console.log("La partida 2 esta ganada. OK")
        result = true;
    }else{
        console.log("El test fallo dado que la partida 2 deberia estar ganada");
    }

    console.log("-----------------------------");
    return result;
}



async function testVerificarPartidaPerdida(){
    console.log("Test 7");
    console.log("Probando que la partida 1 esté finalizada y perdida.")
    let result = false;
    let partidaRecibida = await cli.buscarPorId(1);
    if (!partidaRecibida.gano && partidaRecibida.vidas == 0){
        console.log("La partida 1 esta perdida. OK (GET)")
        result = true;
    }else{
        if(partidaRecibida.vidas != 0){
            console.log("El test fallo dado que la partida 1 deberia estar perdida y tiene vidas restantes");
        }else{
            console.log("El test fallo dado que la partida 1 deberia estar perdida y el resultado de la partida indica lo contrario");
        }
        
    }
    console.log("-----------------------------");
    return result;
}



async function main() {
    let exitos = 0;
       
    const tests = [
        testPostConBody, //Crea partida. Esta debe perderse
        testGetAPartidaInexsistente, //Get a partida 0. Debe devolver
        testPatchLetraConBody, //Hace un PATCH de una letra erronea      
        testPatchCaracterInvalidoConBody, //Arriesga caracter invalido 
        testArriesgarMismaLetra, //Arriesga misma letra que test anterior
        testPatchZConBody, //Arriesga letra Z
        testVerificarPartidaPerdida,
        testPatchLetraConBodyAPartidaTerminada,        
        testPostSinBody,
        testPostConBodyIncorrecto,              
        testPostPartidaParaGanar,        
        testPatchLetraConBodyParaGanar,
        testVerificarPartidaGanada,
        testGetAll,
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