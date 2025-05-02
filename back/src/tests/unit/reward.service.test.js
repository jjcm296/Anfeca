const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const rewardService = require('../../services/rewardService.js');
const Reward = require('../../models/Reward');

const expect = chai.expect;

describe('rewardService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllRewards', () => {
        it('should return all rewards for a guardian', async () => {
            const mockRewards = [{ name: 'Coin Pouch' }];
            sinon.stub(Reward, 'find').resolves(mockRewards);

            const result = await rewardService.getAllRewards('guardianId123');
            expect(result).to.equal(mockRewards);
        });
    });

    describe('createReward', () => {
        it('should throw error if duplicate reward exists', async () => {
            sinon.stub(Reward, 'find').resolves([{}]); // simulate a duplicate

            await expect(rewardService.createReward({
                name: 'Sticker',
                price: 5,
                type: 'once',
                redemptionLimit: 1,
                guardianId: 'g123'
            })).to.be.rejectedWith('The same exact reward already exists');
        });

        it('should create and return a new reward if no duplicate exists', async () => {
            sinon.stub(Reward, 'find').resolves([]);
            const mockReward = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Hat',
                price: 10,
                type: 'custom',
                redemptionLimit: 3,
                guardianId: 'g123'
            };

            const createStub = sinon.stub(Reward, 'create').resolves();
            sinon.stub(Reward, 'findOne').resolves(mockReward);

            const result = await rewardService.createReward(mockReward);
            expect(createStub.calledOnce).to.be.true;
            expect(result).to.equal(mockReward);
        });
    });

    describe('getReward', () => {
        it('should return reward by ID', async () => {
            const mockReward = { name: 'Reward X' };
            sinon.stub(Reward, 'findById').resolves(mockReward);

            const result = await rewardService.getReward('reward123');
            expect(result).to.equal(mockReward);
        });
    });

    describe('editReward', () => {
        it('should throw error if reward not found', async () => {
            sinon.stub(Reward, 'findById').resolves(null);

            await expect(rewardService.editReward('badId', {})).to.be.rejectedWith('Reward not found');
        });

        it('should update and return the reward if found', async () => {
            const mockReward = {
                name: 'Old Name',
                validate: sinon.stub().resolves(),
                save: sinon.stub().resolves()
            };

            sinon.stub(Reward, 'findById').resolves(mockReward);

            const updated = await rewardService.editReward('id123', { name: 'New Name' });

            expect(mockReward.validate.calledOnce).to.be.true;
            expect(mockReward.save.calledOnce).to.be.true;
            expect(updated.name).to.equal('New Name');
        });
    });

    describe('deleteReward', () => {
        it('should call findByIdAndDelete with correct ID', async () => {
            const deleteStub = sinon.stub(Reward, 'findByIdAndDelete').resolves();

            await rewardService.deleteReward('toDelete');
            expect(deleteStub.calledOnceWith('toDelete')).to.be.true;
        });
    });
});
