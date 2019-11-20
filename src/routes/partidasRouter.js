const _ = require('lodash')
const Joi = require('@hapi/joi')
const router = require('express').Router()
const partida = require('../Partida/partida')
const juego = require('../Juego/juego')

const baseURI = '/api/partidas'

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


//Aca crea una partida. Requiere un JSON con formato "mail":"*MAIL*" 
router.post('/', async (req, res) => {
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

        await partida.agregarPartida(nuevaPartida, req.body.mail);

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
    console.log('PATCHING: arriesgando letra en la partida ' + req.url);
    const letra = req.body.letra;
    const id = req.params.id
    // ACA
    const arriesga ={
        id: req.params.id,
        letra : req.body.letra
    }
    try {
         if (juego.esLetraInvalida(arriesga)){
            throw { status: 400, descripcion: 'La letra ingresada no puede ser numero o caracter especial'}
        } 
        const partidaBuscada = partida.getPartidaById(id);
    
        if (partidaBuscada.vidas === 0) {
            // false significa que perdio
            partida.notificarResultado(false, partidaBuscada);
            throw { status:400, descripcion: 'Perdiste, te quedan '+ partidaBuscada.vidas + ' vidas. La palabra en juego era ' + partidaBuscada.palabra}
        }
        partida.esPartidaGanada(partidaBuscada)
        if (partidaBuscada.gano){
            //true significa que gano
            partida.notificarResultado(true,partidaBuscada);
            throw { status:400 , descripcion: 'No puede seguir jugando, pero tranquile, fue porque ganaste, FELICITACIONES'}
        }

        if (partidaBuscada.letrasArriesgadas.includes(letra)){
            throw { status:400, descripcion: 'La letra ' + letra + ' ya fue ingresada anteriormente'}
        } 
       
        partidaBuscada.letrasArriesgadas.push(letra);
        
        partidaBuscada.palabraOculta = partida.verificarLetrasEnPalabra(partidaBuscada, letra);
        
        partidaAux = partida.generarEstadoPartida(partidaBuscada)

        res.status(201).json(partidaAux)
    } catch (err) {
        res.status(err.status).json(err)
    } 
})


//Verifica con Joi si el formato de partida es valido
function esPartidaInvalida(partida) {
    const esquema = {
        id: Joi.number().integer().min(0),
        mail: Joi.string().email().required(),
    }
    const { error } = Joi.validate(partida, esquema)
    return error
}


module.exports = router