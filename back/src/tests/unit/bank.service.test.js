const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const bankService = require('../../services/bankService');
const Bank = require('../../models/Bank');
const questionService = require('../../services/questionService');

describe('bankService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllBanks', () => {
        it('should return all banks for a guardian', async () => {
            const mockBanks = [{ name: 'Bank 1' }, { name: 'Bank 2' }];
            sinon.stub(Bank, 'find').resolves(mockBanks);

            const result = await bankService.getAllBanks('g123');
            expect(result).to.deep.equal(mockBanks);
        });
    });

    describe('createBank', () => {
        it('should throw error if duplicate bank exists', async () => {
            sinon.stub(Bank, 'find').resolves([{ name: 'Bank 1' }]);

            await expect(bankService.createBank({ name: 'Bank 1', guardianId: 'g123' }))
                .to.be.rejectedWith('You already have a bank named like that');
        });

        it('should create and return a new bank if no duplicate exists', async () => {
            sinon.stub(Bank, 'find').resolves([]);
            const mockCreatedBank = { _id: 'id123', name: 'New Bank', guardianId: 'g123' };
            sinon.stub(Bank, 'create').resolves();
            sinon.stub(Bank, 'findOne').resolves(mockCreatedBank);

            const result = await bankService.createBank({ name: 'New Bank', guardianId: 'g123' });
            expect(result).to.deep.equal(mockCreatedBank);
        });
    });

    describe('getBank', () => {
        it('should return bank if found', async () => {
            const mockBank = { name: 'Bank X' };
            sinon.stub(Bank, 'findById').resolves(mockBank);

            const result = await bankService.getBank('bank123');
            expect(result).to.equal(mockBank);
        });

        it('should throw error if bank not found', async () => {
            sinon.stub(Bank, 'findById').resolves(null);

            await expect(bankService.getBank('badId')).to.be.rejectedWith('Bank not found in the database');
        });
    });

    describe('editBank', () => {
        it('should throw error if original bank not found', async () => {
            sinon.stub(Bank, 'findByIdAndUpdate').resolves(null);

            await expect(bankService.editBank('badId', { name: 'Updated' }))
                .to.be.rejectedWith('Bank not found');
        });

        it('should throw error if updated bank not found', async () => {
            sinon.stub(Bank, 'findByIdAndUpdate').resolves({});
            sinon.stub(Bank, 'findById').resolves(null);

            await expect(bankService.editBank('id123', { name: 'Updated' }))
                .to.be.rejectedWith('Updated bank not found');
        });

        it('should return updated bank if successful', async () => {
            const updatedBank = { _id: 'id123', name: 'Updated Bank' };
            sinon.stub(Bank, 'findByIdAndUpdate').resolves({});
            sinon.stub(Bank, 'findById').resolves(updatedBank);

            const result = await bankService.editBank('id123', { name: 'Updated Bank' });
            expect(result).to.deep.equal(updatedBank);
        });
    });

    describe('deleteBank', () => {
        it('should delete bank and its questions', async () => {
            const deleteStub = sinon.stub(Bank, 'findByIdAndDelete').resolves();
            const questionStub = sinon.stub(questionService, 'deleteQuestionsByBankId').resolves();

            await bankService.deleteBank('bankId123');

            expect(deleteStub.calledOnceWith('bankId123')).to.be.true;
            expect(questionStub.calledOnceWith('bankId123')).to.be.true;
        });
    });
});
