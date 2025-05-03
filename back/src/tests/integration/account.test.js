process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, initializeApp } = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;


before(async () => {
    await initializeApp();
});

describe('+*°*°*°+*+°* ACCOUNT TESTS +*°*°*°+*+°*', ()=> {
    let accessToken = '';
    let refreshToken = '';
    let guardianPassword = "JpinoUv*03";
    const email = "test_PRUEBA@example.com"; // email of the existing test account

    it('should login and return tokens', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                email,
                password: guardianPassword
            })
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(200);
                accessToken = res.body.accessToken;
                refreshToken = res.body.refreshToken;
                done();
            });
    });

    it('should switch to kid profile', (done) => {
        chai.request(app)
            .post('/api/account/profiles/switch')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ targetProfile: 'kid' })
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('newAccessToken');
                accessToken = res.body.newAccessToken;
                done();
            });
    });

    it('should switch back to guardian profile', (done) => {
        chai.request(app)
            .post('/api/account/profiles/switch')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ targetProfile: 'guardian', password: guardianPassword })
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('newAccessToken');
                accessToken = res.body.accessToken;
                done();
            });
    });
});