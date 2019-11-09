const express = require("express");
const _ = require("lodash");

const app = express();

app.use(express.json());
app.set("json spaces", 4);

// base de datos

const palabras = [{"palabra":"Programacion","definicion":"Materia piola"},
                  {"palabra":"Matematica","definicion":"Materia aburrida"},
                  {"palabra":"Ingles","definicion":"What is this?"}
                ];

// ruta

//este GET tiene como funcion principal obtener una palabra aleatoria consumiendo la api
app.get("/api/palabras", (req, res) => {
  console.log("GETTING: " + req.url);
  try {
    let result;
    result = getPalabraAleatoria();
    if (_.isEmpty(result)) {
      throw { status: 404, descripcion: "No hay palabras" };
    } 
    res.json(result);
  } catch (err) {
    res.status(err.status).json(err);
  }
});

function getPalabraAleatoria(){
  return palabras[Math.floor(Math.random()*palabras.length)]
}





const puerto = 8080;
app.listen(puerto, () => {
  console.log(`servidor inicializado en puerto ${puerto}`);
});

module.exports = {
  getPalabraAleatoria,
}