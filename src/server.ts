import { env } from "./env";
import 'dotenv/config'
import { app } from "./app";


app
    .listen({ 
        port: env.PORT
    })
    .then(() => {
        console.log('HTTP server Running!')
    })
