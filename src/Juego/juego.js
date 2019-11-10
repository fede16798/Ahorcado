function esLetraInvalida(game){
    const esquema = {
        id: Joi.number().integer().min(0),
        letra: Joi.string().regex(/^[a-zA-Z]*$/).min(1).max(1).required()
    }
    const { error } = Joi.validate(game,esquema);
    return error;
}


module.exports = {
    esLetraInvalida
}