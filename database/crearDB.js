/* eslint-disable no-console */
const knex = require('knex')({
    client: 'sqlite3',
    connection: { filename: './database/mydb.sqlite' },
    useNullAsDefault: true
})

knex.schema.createTable('partidas', (table) => {
    table.increments('id')
    table.string('palabra')
    table.string('mail')
    table.string('vidas')
    table.boolean('resultado')
})
    .then(() => console.log("listo"))
    .catch(error => console.log(error))