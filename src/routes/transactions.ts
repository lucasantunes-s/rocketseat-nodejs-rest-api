import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { string, z } from "zod"
import { randomUUID } from "crypto"
import { checkSessionIdExist } from "../middleware/check-session-id-exist"


export async function transactionsRoutes(app: FastifyInstance) {
    // app.addHook('preHandler', async (request, reply) => {
    //     console.log('testandooo')
    // })
    
    app.get(
        '/', 
        {
            preHandler: [checkSessionIdExist],
        },
        async (request, reply) => {
            const { sessionId } = request.cookies

            const transactions = await knex('transactions')
                .where('session_id', sessionId)
                .select()

            return { transactions }
        },
    )
    
    app.get(
        '/:id',
        { 
            preHandler: [checkSessionIdExist]
        },
        async (request, reply) => {
            const getOneTransactionParamsSchema = z.object({
                id: string().uuid()
            })
    
            const { id } = getOneTransactionParamsSchema.parse(request.params)

            const { sessionId } = request.cookies
    
            const transaction = await knex('transactions')
                .where({
                    session_id: sessionId,
                    id,
                })
                .first()
    
            return { transaction }
        }
    )

    app.get(
        '/summary',
        {
            preHandler: [checkSessionIdExist]
        },
        async (request, reply) => {
            const { sessionId } = request.cookies

            const summary = await knex('transactions')
                .where('session_id', sessionId)
                .sum('amount', { as: 'amount' })
                .first()

            return { summary }
        }
    )

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
}