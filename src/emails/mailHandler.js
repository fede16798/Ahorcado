const nodemailer = require('nodemailer');
const Email = require('email-templates');


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ahorcadoort2019@gmail.com",
    pass: "mejorestudiomaestrojardinero"
  }
});

const email = new Email({
  transport: transporter,
  send: true,
  preview: false,
});

exports.mandarMail = function(resultado,partida) {
  //let plantilla = 'templateperdio';
  if(resultado){
    plantilla = 'templategano'
  }
  let usuario = obtenerUsuario(partida.mail);
 
    email.send({
    template: "bye",
    message: {
      from: 'Ahorcado <ahorcadoort2019@gmail.com>',
      to: partida.mail,
    },
    locals: {
      fname: usuario,
      word: partida.palabra,
      vidas: partida.vidas,
      palabraOculta: palabra.palabraOculta,
      id: partida.id
    }
  
  }).then(() => console.log('email has been sent!')).catch(e => console.error(`No se envio el mail: ${e}`)); 
}

function obtenerUsuario(mail){
let usuario = mail.split('@')[0];
return usuario;
}



