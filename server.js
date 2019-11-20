const express = require('express')
const app = express()

app.use(express.json())
app.set('json spaces', 4)

const partidasRouter = require('./src/routes/partidasRouter')
app.use('/api/partidas',partidasRouter)

const puerto = 5001
app.listen(puerto, () => {
    // eslint-disable-next-line no-console
    console.log(`servidor inicializado en puerto ${puerto}`)
})
