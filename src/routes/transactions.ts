import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { string, z } from "zod"
import { randomUUID } from "crypto"


export async function transactionsRoutes(app: FastifyInstance) {
    app.get('/', async (request, reply) => {
        const transactions = await knex('transactions').select()

        return { transactions }
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
     
    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const {title, amount, type} = createTransactionBodySchema.parse(request.body)
        
        await knex('transactions')
            .insert({
                id: randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount * -1,
            })
            
        return reply.status(201).send()
    })
}