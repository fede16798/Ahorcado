const request = require('request');


let letra = "!";
let palabras= ["Lewandoski" , "Cristiano", "lucas" , "Fede", "seba"];
let palabra = "";
let palabraOculta = "";
let definicion = "";

// exports.traerPalabra = function(){
//     request('http://localhost:8080/api/palabraAleatoria', { json: true }, (err, res, body) => { 
// if (err) { return console.log(err); }
// palabraCompleta = res.body;
// console.log( palabraCompleta.palabra)
// let palabra = JSON.parse(body);
// console.log("palabra " + palabra["palabra"])
// });
// }

// console.log(traerPalabra());




function seleccionarPalabra(palabras){
    let index = Math.floor(Math.random() * palabras.length);
    this.palabra = palabras[index];
    console.log("palabra " + this.palabra);
}

seleccionarPalabra(palabras);
function ocultarPalabra(){
    let num;
    let palabraOcult = "";
    //consigo cantida de guiones necesarios
    for (let index = 0; index < this.palabra.length; index++) {
        num = index;
    }
    num++;
   // iguala la palabra oculta a la palabra elegida
    for (let i = 0; i < num; i++){
       palabraOcult = ("-" + palabraOcult)
    }

    console.log("cantidad de letras " + num );
    console.log("palabra oculta " + palabraOcult);

    return palabraOcult;
}

palabraOculta = ocultarPalabra(palabra);

function esLetraRegular(letra){
    let regEx = new RegExp("^[a-zA-Z\s]{1,1}$");
    return regEx.test(letra);
}

console.log(esLetraRegular(letra));

function verificarLetrasEnPalabra (palabra, palabraOcul, letra) {
    palabra = palabra.toLowerCase();
    letra = letra.toLowerCase();
    for (let index = 0; index < palabra.length; index++) {
        if (palabra[index] == letra) {
            console.log("letra acertada ");
            console.log(palabraOcul[index] = letra);
        } else { 
            console.log("la letra es erronea");
        }
    }
    return palabraOcul;
}

console.log(verificarLetrasEnPalabra(palabra, palabraOculta, ("e")));