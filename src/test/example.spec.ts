import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest';
import { app } from '../app';
import { execSync } from 'node:child_process';



describe('Transaction routes', () => {
    beforeAll(async () => {
        await app.ready()
    })
    
    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })
    
    it('should be able to create a new transaction', async () => {
    
        const teste = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit',
            })

        console.log(teste.body)    
    })

    it('should be able list all transactions', async () => {
    
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit',
            })
            .expect(201)
    
        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)    
            
    
        expect(listTransactionResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New Transaction',
                amount: 5000,
            })
        ])
    })    
})

