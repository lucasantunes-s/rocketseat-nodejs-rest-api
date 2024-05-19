import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
    NODE_ENV: z.enum(['production', 'test', 'development']).default('production'),
    PORT: z.number().default(3333),
    DATABASE_URL: z.string(),
}) 

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error('Enviroment variables not found!', _env.error.format())
    
    throw new Error('Enviroment variables not found.')
}

export const env = _env.data
