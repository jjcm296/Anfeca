const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = chai.expect;

const accountService = require('../../services/accountService');
const Account = require('../../models/Account');
const Session = require('../../models/Session');
const Reward = require('../../models/Reward');
const Bank = require('../../models/Bank');
const Question = require('../../models/Question');
const Kid = require('../../models/Kid');
const Guardian = require('../../models/Guardian');
const bcrypt = require('bcrypt');

describe('accountService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('checkPassword', () => {
        it('should return true if passwords match', async () => {
            const fakeAccount = {
                _id: 'acc123',
                password: 'hashed',
            };
            sinon.stub(Account, 'findById').returns({
                select: sinon.stub().resolves(fakeAccount),
            });
            sinon.stub(bcrypt, 'compare').resolves(true);

            const result = await accountService.checkPassword('plain', 'acc123');
            expect(result).to.be.true;
        });

        it('should throw error if account not found', async () => {
            sinon.stub(Account, 'findById').returns({
                select: sinon.stub().resolves(null),
            });

            try {
                await accountService.checkPassword('pass', 'wrongId');
            } catch (err) {
                expect(err.message).to.equal('Account not found');
            }
        });
    });

    describe('deleteAccount', () => {
        it('should delete account and related data', async () => {
            const accountId = 'acc123';
            const guardianId = 'g123';
            const banks = [{ _id: 'b1' }, { _id: 'b2' }];

            sinon.stub(Account, 'findById').resolves({ _id: accountId, guardianId });
            sinon.stub(Session, 'deleteMany').resolves();
            sinon.stub(Reward, 'deleteMany').resolves();
            sinon.stub(Bank, 'find').resolves(banks);
            sinon.stub(Bank, 'deleteMany').resolves();
            sinon.stub(Question, 'deleteMany').resolves();
            sinon.stub(Kid, 'findOneAndDelete').resolves();
            sinon.stub(Guardian, 'findByIdAndDelete').resolves();
            sinon.stub(Account, 'findByIdAndDelete').resolves();

            const result = await accountService.deleteAccount(accountId);
            expect(result).to.be.true;
        });

        it('should throw error if account not found', async () => {
            sinon.stub(Account, 'findById').resolves(null);

            try {
                await accountService.deleteAccount('wrongId');
            } catch (err) {
                expect(err.message).to.equal('Account not found');
            }
        });
    });
});
