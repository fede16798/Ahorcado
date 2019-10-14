const express = require('express');
const app = express();

app.use(express.json());

app.post('/user', (req, res) => {
    res.send({
        username: '',
        lastname: ''
    });
    console.log(req.params);
});

/*app.post('/user/:id', (req, res) => {
    console.log(req.body);
    console.log(req.params);
    res.send('Peticion POST recibido');
});*/

app.delete('/user/:userId', (req, res) => {
    res.send(`Usuario ${req.params.userId} ha sido eliminado`);
});

app.put('/user/:id', (req, res) => {
    console.log(req.body);
    res.send(`Usuario ${req.params.id} ha sido actualizado`);
});

app.listen(5000, ()=> {
    console.log('Servidor en puerto 5000');
});