process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, initializeApp } = require('../app.js');

chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();

before(async () => {
    await initializeApp();
});

describe('/First Test Collection', () => {

    it('should test two values.....', () => {
        let expectedVal = 10;
        let actualVal = 10;
        expect(actualVal).to.be.equal(expectedVal);
    });
});