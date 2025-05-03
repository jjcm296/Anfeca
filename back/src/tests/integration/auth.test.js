process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, initializeApp } = require('../../app');
const VerificationCode = require('../../models/VerificationCode.js');

chai.use(chaiHttp);
const expect = chai.expect;


before(async () => {
    await initializeApp();
});

describe('+*°*°*°+*+°* AUTH TESTS +*°*°*°+*+°*', ()=> {
    const testEmail= `test_${Date.now()}@example.com`;
    const testPassword= "JpinoUv*03"
    before(async () => {
        await VerificationCode.create({
            email: testEmail,
            code: "123456",
            isVerified: true
        });
    });

    it('should register a new account and guardian', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                name: "Javier",
                lastName: `Pino ${Date.now()}` ,
                email: testEmail,
                password: testPassword
            })
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('guardian');
                expect(res.body).to.have.property('account');
                done();
            });
    });

    let accessToken = '';

    it('should login and return tokens', (done) => {
       chai.request(app)
           .post('/api/auth/login')
           .send({
               email: testEmail,
               password: testPassword
           })
           .end((err, res) => {
               console.log('[RESPONSE BODY]')
               console.log(res.body);
               console.log('----------------------------------')
               console.log()
               expect(res).to.have.status(200);
               expect(res.body).to.have.property('accessToken');
               accessToken = res.body.accessToken;

               expect(res.body).to.have.property('refreshToken');
               expect(res.body.message).to.equal('Login successful');
               done();
           })
    });

    it('should create a kid profile for the account', (done) => {
        let name = `Diana ${Date.now()}`;
        chai.request(app)
            .post('/api/kids')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name  })
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('kid');
                expect(res.body.kid.name).to.equal(name);
                done();
            });
    });
});