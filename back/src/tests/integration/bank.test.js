
process.env.NODE_ENV = 'test';

const chai = require('chai');
const Session = require('../../models/Session.js')
const chaiHttp = require('chai-http');
const { app, initializeApp } = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

let accessToken = '';
let refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTQxOWQ0NDcxNjkxNDdjNDE5MjE5NCIsImd1YXJkaWFuSWQiOiI2ODE0MTlkNDQ3MTY5MTQ3YzQxOTIxOTIiLCJwcm9maWxlVHlwZSI6Imd1YXJkaWFuIiwiaWF0IjoxNzQ2NDE2Mzg3LCJleHAiOjE3NDk4NzIzODd9.7_UWlUoLeSjYsLemad_FKAlZw3vEux6cQk1IZ7yikNM';
let bankName = `Test Bank ${Date.now()} `

let createdBankId = '';


before(async () => {


    await initializeApp();
});

describe('/Bank tests', () => {

    // Get new access token
    it('should get a new access token', (done) => {
        chai.request(app)
            .post('/api/auth/token/refresh')  // Assuming this is your token refresh route
            .send({
                refreshToken
            })
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(200);
                accessToken = res.body.accessToken;
                expect(accessToken).to.exist;
                done();
            });
    });

    // Test create bank with specific account and guardian IDs
    it('should create a bank', (done) => {
        const newBankData = {
            name: bankName
        };

        chai.request(app)
            .post('/api/banks')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(newBankData)
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(201);
                expect(res.body.bank).to.have.property('name').equal(bankName);
                createdBankId = res.body.bank._id;
                done();
            });
    });

    it('should edit the created bank', (done) => {
        const updatedData = { name: 'Updated Bank Name' };

        chai.request(app)
            .put(`/api/banks/${createdBankId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updatedData)
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(200);
                expect(res.body.updatedBank).to.have.property('name', 'Updated Bank Name');
                done();
            });
    });

    it('should delete the created bank', (done) => {
        chai.request(app)
            .delete(`/api/banks/${createdBankId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(200);
                expect(res.body.message).to.include('Bank deleted successfully');
                done();
            });
    });
});
