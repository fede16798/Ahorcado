const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()
const partidaImportada = require('../Partida/daoFactoryPartida')
const partida = partidaImportada.getPartidaDAO();

const baseURI = '/api/partidas'

router.get('/', (req, res) => {
    console.log('GETTING: ' + baseURI + req.url)
    try {
        res.json(partida.getPartidas())
    } catch (err) {
        res.status(err.status).json(err)
    }
})

router.get('/:id', (req, res) => {
    console.log('GETTING: ' + req.url)

    try {
        const partidaBuscada = partida.getPartidaById(req.params.id)

        if (!partidaBuscada) {
            throw { status: 404, descripcion: 'partida no encontrada' }
        }
        res.json(partidaBuscada)
    } catch (err) {
        res.status(err.status).json(err)
    }
})

//Aca crea una partida. Requiere un JSON con formato "mail":"*MAIL*" 
router.post('/', async (req, res) => {
    console.log('POSTING: ' + req.url)

    const JSON_mail = req.body

    try {
        if (esJSONInvalido(JSON_mail)) {
            throw { status: 400, descripcion: 'El JSON recibido no posee un formato valido' }
        }

        // const partidaBuscada = partida.getPartidaById(nuevaPartida.id);
        // if (partidaBuscada) {
        //     throw { status: 403, descripcion: 'ya existe un partida con ese id' }
        // };

        nuevaPartida = await partida.agregarPartida(JSON_mail.mail);


        //Cuando crea la partida muestra informacion de la misma
        partidaAux = partida.generarEstadoPartida(nuevaPartida);
        res.status(201).json(partidaAux);

    } 
    catch (err) {
        console.log(err)
        res.status(err.status).json(err);
    }
})

router.patch('/:id', (req, res) => {
    console.log('PATCHING: arriesgando letra ' + req.body.letra + ' en la partida ' + req.url);
    const letra = req.body.letra;
    const id = req.params.id
    // ACA
    const arriesga ={
        id: req.params.id,
        letra : req.body.letra
    }
    try {
        const partidaBuscada = partida.getPartidaById(req.params.id)

        if (!partidaBuscada) {
            throw { status: 404, descripcion: 'partida no encontrada' }
        }

         if (esLetraInvalida(arriesga)){
            throw { status: 400, descripcion: 'La letra ingresada no puede ser numero o caracter especial'}
        } 
       
        if (partidaBuscada.vidas === 0) {
            // false significa que perdio
            partida.notificarResultado(false, partidaBuscada);
            throw { status: 400, descripcion: 'Perdiste, te quedan '+ partidaBuscada.vidas + ' vidas. La palabra en juego era ' + partidaBuscada.palabra}
        }
        partida.esPartidaGanada(partidaBuscada)
        if (partidaBuscada.gano){
            //true significa que gano
            partida.notificarResultado(true,partidaBuscada);
            throw { status: 400 , descripcion: 'No puede seguir jugando, pero tranquile, fue porque ganaste, FELICITACIONES'}
        }

        if (partidaBuscada.letrasArriesgadas.includes(letra)){
            throw { status:403, descripcion: 'La letra ' + letra + ' ya fue ingresada anteriormente'}
        } 
       
        partidaBuscada.letrasArriesgadas.push(letra);
        
        partidaBuscada.palabraOculta = partida.verificarLetrasEnPalabra(partidaBuscada, letra);

        if (partidaBuscada.vidas === 0) {
            // false significa que perdio
            partida.notificarResultado(false, partidaBuscada);
            throw { status: 200, descripcion: 'Perdiste, te quedan '+ partidaBuscada.vidas + ' vidas. La palabra en juego era ' + partidaBuscada.palabra}
        }
        partida.esPartidaGanada(partidaBuscada)
        if (partidaBuscada.gano){
            //true significa que gano
            partida.notificarResultado(true,partidaBuscada);
            throw { status: 200 , descripcion: 'No puede seguir jugando, pero tranquile, fue porque ganaste, FELICITACIONES'}
        }

        partidaAux = partida.generarEstadoPartida(partidaBuscada)

        res.status(200).json(partidaAux)
    } catch (err) {
        res.status(err.status).json(err)
    } 
})


//Verifica con Joi si el JSON recibido es valido
function esJSONInvalido(json_recibido) {
    const esquema = {
        mail: Joi.string().email().required(),
    }
    const { error } = Joi.validate(json_recibido, esquema)
    return error
}

function esLetraInvalida(game){
    console.log("validando letra")
    const esquema = {
        id: Joi.number().integer().min(0),
        letra: Joi.string().regex(/^[a-zA-Z]$/).min(1).max(1).required()
    }
    const {error} = Joi.validate(game,esquema);
    return error;
}


module.exports = router