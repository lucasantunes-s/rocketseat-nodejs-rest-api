import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { string, z } from "zod"
import { randomUUID } from "crypto"


export async function transactionsRoutes(app: FastifyInstance) {
    app.get('/', async (request, reply) => {
        const transactions = await knex('transactions').select()

        return { transactions }
    })
    
    
    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })
        
        const {title, amount, type} = createTransactionBodySchema.parse(request.body)

        let session_id = request.cookies.sessionId

        if(!session_id) {
            session_id = randomUUID()

            reply.cookie('sessionId', session_id, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
        }

        
        await knex('transactions')
        .insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id,
        })
        
        return reply.status(201).send()
    })

    app.get('/:id', async (request, reply) => {
        console.log('id')
    
        const getOneTransactionParamsSchema = z.object({
            id: string().uuid()
        })
    
        const { id } = getOneTransactionParamsSchema.parse(request.params)
    
        const transaction = await knex('transactions').where('id', id).first()
    
        return { transaction }
    })

    app.get('/summary', async (request, reply) => {
        const summary = await knex('transactions')
            .sum('amount', { as: 'amount' })
            .first()

        return { summary }
    })
}