const express = require("express");
const _ = require("lodash");

const app = express();

app.use(express.json());
app.set("json spaces", 4);

// base de datos

const palabras = [{"palabra":"solid","definicion":"En ingeniería de software, SOLID es un acrónimo mnemónico introducido por Robert C. Martin​​ a comienzos de la década del 2000​ que representa cinco principios básicos de la programación orientada a objetos y el diseño."},
                  {"palabra":"abstraccion","definicion":"La abstracción consiste en aislar un elemento de su contexto o del resto de los elementos que lo acompañan. En programación, el término se refiere al énfasis en el ¿qué hace? más que en el ¿cómo lo hace?"},
                  {"palabra":"interfaz","definicion":"se utiliza para nombrar a la conexión funcional entre dos sistemas, programas, dispositivos o componentes de cualquier tipo, que proporciona una comunicación de distintos niveles permitiendo el intercambio de información."}
                ];

// ruta

//este GET tiene como funcion principal obtener una palabra aleatoria consumiendo la api
app.get("/api/palabra", (req, res) => {
  console.log("GETTING: " + req.url);
  try {
    let result;
    result = seleccionarPalabra();
    if (_.isEmpty(result)) {
      throw { status: 404, descripcion: "No hay palabras" };
    } 
    res.json(result);
  }catch (err) {
    res.status(err.status).json(err);
  }
});

function seleccionarPalabra(){
  let index = Math.floor(Math.random() * palabras.length);
  let palabra = palabras[index]
  return palabra;
}

const puerto = 8080;
app.listen(puerto, () => {
  console.log(`servidor inicializado en puerto ${puerto}`);
});

module.exports = {
  seleccionarPalabra,
}