const express = require("express");
const _ = require("lodash");

const app = express();

app.use(express.json());
app.set("json spaces", 4);

// base de datos

const palabras = [{"palabra": "solid","definicion":"En ingeniería de software, SOLID es un acrónimo mnemónico introducido por Robert C. Martin​​ a comienzos de la década del 2000​ que representa cinco principios básicos de la programación orientada a objetos y el diseño."},
                  {"palabra": "abstraccion","definicion":"La abstracción consiste en aislar un elemento de su contexto o del resto de los elementos que lo acompañan. En programación, el término se refiere al énfasis en el ¿qué hace? más que en el ¿cómo lo hace?"},
                  {"palabra": "interfaz","definicion":"se utiliza para nombrar a la conexión funcional entre dos sistemas, programas, dispositivos o componentes de cualquier tipo, que proporciona una comunicación de distintos niveles permitiendo el intercambio de información."},
                  {"palabra": "java", "definicion": "Lenguaje de programación y una plataforma informática comercializada por primera vez en 1995"},
                  {"palabra": "turing", "definicion": "Considerado uno de los padres de la ciencia de la computación y precursor de la informática moderna"},
                  {"palabra": "enigma" , "definicion": "Maquina de rotores que permitía usarla tanto para cifrar como para descifrar mensajes"},
                  {"palabra": "programacion", "definicion": "La programación informática es el proceso por medio del cual se diseña, codifica, limpia y protege el código fuente de programas computacionales"},
                  {"palabra": "archie", "definicion": " Herramienta que permite localizar archivos en la red Internet creada en Montreal por la Universidad de McGill. Un server de Archie (hay varios distribuidos por toda Internet) mantiene una base de datos que registra la ubicación de varios miles de archivos"},
                  {"palabra": "encriptar", "definicion": "proteger archivos expresando su contenido en un lenguaje cifrado. Los lenguajes cifrados simples consisten, por ejemplo, en la sustitución de letras por números"},
                  {"palabra": "navegador", "definicion": "programa para recorrer la World Wide Web"},
                  {"palabra": "puerto", "definicion": "en una computadora, es el lugar específico de conexión con otro dispositivo, generalmente mediante un enchufe. Puede tratarse de un puerto serial o de un puerto paralelo."},
                  {"palabra": "periferico", "definicion": "todo dispositivo que se conecta a la computadora"},
                  {"palabra": "protocolo", "definicion": "conjunto de reglas formales que describen como se trasmiten los datos, especialmente a través de la red"},
                  {"palabra": "latencia", "definicion": "lapso necesario para que un paquete de información viaje desde la fuente hasta su destino."},
                  {"palabra": "buffer", "definicion": "área de la memoria que se utiliza para almacenar datos temporariamente durante una sesión de trabajo"}
                ];
// ruta

//este GET tiene como funcion principal obtener una palabra aleatoria consumiendo la api
app.get("/api/palabra", (req, res) => {
  console.log("GETTING: " + req.url);
  try {
    let result;
    result = seleccionarPalabra();
    if (_.isEmpty(result)) {
      throw { status: 500, descripcion: "No hay palabras" };
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
  // seleccionarPalabra,
}