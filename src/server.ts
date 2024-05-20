import fastify from "fastify";
import { env } from "./env";
import 'dotenv/config'
import { transactionsRoutes } from "./routes/transactions";
import cookies from '@fastify/cookie'

const app = fastify();

app.register(cookies)

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
