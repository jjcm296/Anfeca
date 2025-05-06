process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, initializeApp } = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

let accessToken = '';
let refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTQxOWQ0NDcxNjkxNDdjNDE5MjE5NCIsImd1YXJkaWFuSWQiOiI2ODE0MTlkNDQ3MTY5MTQ3YzQxOTIxOTIiLCJwcm9maWxlVHlwZSI6Imd1YXJkaWFuIiwiaWF0IjoxNzQ2NDU2MzE0LCJleHAiOjE3NDk5MTIzMTR9.kdJxGQEzJZmjGd-6k-rWr3JMXFn8mydmZ_Mt-00vnYs';
let createdQuestionId = '';
const bankId = '6814522194beaded369f56e7';


before(async () => {
    await initializeApp();
});

describe('+*°*°*°+*+°* QUESTION TESTS +*°*°*°+*+°*', ()=> {
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

    it('should create a question and print a flashcard', (done) => {
        const questionData = {
            textQuestion: `¿Cuál es la capital de Francia? ${Date.now()}`,
            priority: 1,
            answers: [
                { textAnswer: 'Madrid', isCorrect: false },
                { textAnswer: 'Berlín', isCorrect: false },
                { textAnswer: 'París', isCorrect: true },
                { textAnswer: 'Roma', isCorrect: false }
            ]
        };

        chai.request(app)
            .post(`/api/banks/${bankId}/questions`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(questionData)
            .end((err, res) => {
                console.log('[RESPONSE BODY]')
                console.log(res.body);
                console.log('----------------------------------')
                console.log()
                expect(res).to.have.status(201);
                expect(res.body.question).to.have.property('textQuestion').that.includes('capital de Francia');
                createdQuestionId = res.body.question._id;
                done();
            });
    });


})