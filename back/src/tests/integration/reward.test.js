process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, initializeApp } = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

let accessToken = '';
let refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTQxOWQ0NDcxNjkxNDdjNDE5MjE5NCIsImd1YXJkaWFuSWQiOiI2ODE0MTlkNDQ3MTY5MTQ3YzQxOTIxOTIiLCJwcm9maWxlVHlwZSI6Imd1YXJkaWFuIiwiaWF0IjoxNzQ2MTg3MDkxLCJleHAiOjE3NDk2NDMwOTF9.Xiy4SROEZZQsxCZxwZjQWWBTszqYmPYcMfMFlF5sWBE';
let createdRewardId = '';
let rewardName = `Test Reward ${Date.now()}`;


before(async () => {
    await initializeApp();
});

describe('+*°*°*°+*+°* REWARD TESTS +*°*°*°+*+°*', () => {

    it('should get a new access token', (done) => {
        chai.request(app)
            .post('/api/auth/token/refresh')
            .send({ refreshToken })
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

    it('should create a reward', (done) => {
        const rewardData = {
            name: rewardName,
            price: 10,
            type: 'forever',
        };

        chai.request(app)
            .post('/api/rewards')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(rewardData)
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(201);
                expect(res.body.reward).to.have.property('name', rewardName);
                createdRewardId = res.body.reward._id;
                done();
            });
    });

    it('should edit the created reward', (done) => {
        const updatedData = {
            name: 'Updated Reward Name',
            price: 15
        };

        chai.request(app)
            .put(`/api/rewards/${createdRewardId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updatedData)
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(200);
                expect(res.body.updatedReward).to.have.property('name', 'Updated Reward Name');
                expect(res.body.updatedReward).to.have.property('price', 15);
                done();
            });
    });

    it('should delete the created reward', (done) => {
        chai.request(app)
            .delete(`/api/rewards/${createdRewardId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(200);
                expect(res.body.message).to.include('Reward deleted successfully');
                done();
            });
    });
});
