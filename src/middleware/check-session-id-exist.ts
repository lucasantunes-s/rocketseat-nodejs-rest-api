import { FastifyRequest } from "fastify"
import { FastifyReply } from "fastify/types/reply"


export async function checkSessionIdExist(request: FastifyRequest, reply: FastifyReply) {
    const  sessionId  = request.cookies.sessionId

    if (!sessionId) {
        return reply.status(401).send({
            error: 'Unauthorized.'
        })
    }
}