import fastify from "fastify";
import { knex } from "./database";
import crypto from 'node:crypto'


const app = fastify();

app.get('/hello', async () => {
    const transactions = await knex('transactions')
        .where('amount', 500)
        .select('*')
        .returning('*')

    return transactions

})

app
    .listen({ 
        port: 3333,
    })
    .then(() => {
        console.log('HTTP server Running!')
    })
