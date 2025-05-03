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
    const testEmail= `test_PRUEBA@example.com`;
    const testPassword= "JpinoUv*03"
    before(async () => {
        await VerificationCode.create({
            email: testEmail,
            code: "123456",
            isVerified: true
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
                console.log('refreshToken',res.body.refreshToken);

                expect(res.body).to.have.property('refreshToken');
                expect(res.body.message).to.equal('Login successful');
                done();
            })
    });
});