import fastify from "fastify";
import { knex } from "./database";
import { env } from "./env";
import 'dotenv/config'
import { transactionsRoutes } from "./routes/transactions";


const app = fastify();

app.register(transactionsRoutes, {
    prefix: 'transactions',
})

app
    .listen({ 
        port: env.PORT
    })
    .then(() => {
        console.log('HTTP server Running!')
    })
