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
  let plantilla = "TemplatePerdio";
  if(resultado){
    plantilla = 'TemplateGano'
  }
  email.send({
    template: plantilla,
    message: {
      from: 'Ahorcado <ahorcadoort2019@gmail.com>',
      to: partida.mail,
    },
    locals: {
      fname: "Jugador",
      word: partida.palabra,
      vidas: partida.vidas,
      palabraOculta: palabra.palabraOculta
    }
  
  }).then(() => console.log('email has been sent!'));
}



