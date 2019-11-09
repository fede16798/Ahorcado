const palabras= ["auto" , "moto", "odontologo", "medico", "profesor", "computadora", "cuatriciclo" , "monopatin"];

function seleccionarPalabra(){
    let index = Math.floor(Math.random() * palabras.length);
    let palabra = palabras[index].toLowerCase();
    console.log("palabra " + palabra);
    return palabra;
}

module.exports = {
    seleccionarPalabra
}