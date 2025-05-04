const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const questionService = require('../../services/questionService');
const Question = require('../../models/Question');

describe('questionService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllQuestions', () => {
        it('should return all questions for a bank', async () => {
            const mockQuestions = [{ textQuestion: 'Q1' }, { textQuestion: 'Q2' }];
            sinon.stub(Question, 'find').resolves(mockQuestions);

            const result = await questionService.getAllQuestions('bank123');
            expect(result).to.deep.equal(mockQuestions);
        });
    });

    describe('createQuestion', () => {
        it('should throw error if duplicate question exists', async () => {
            sinon.stub(Question, 'find').resolves([{}]); // duplicate exists

            await expect(questionService.createQuestion({
                textQuestion: 'What is 2+2?',
                answers: [{ textAnswer: '4', isCorrect: true }],
                priority: 1,
                bankId: 'bank1'
            })).to.be.rejectedWith('The same exact question already exists');
        });

        it('should create and return a new question if no duplicate', async () => {
            sinon.stub(Question, 'find').resolves([]);
            sinon.stub(Question, 'create').resolves();
            const mockQuestion = {
                _id: 'q1',
                textQuestion: 'What is 2+2?',
                answers: [{ textAnswer: '4', isCorrect: true }],
                priority: 1,
                bankId: 'bank1'
            };
            sinon.stub(Question, 'findOne').resolves(mockQuestion);

            const result = await questionService.createQuestion(mockQuestion);
            expect(result).to.deep.equal(mockQuestion);
        });
    });

    describe('getQuestion', () => {
        it('should return question by ID', async () => {
            const mockQuestion = { textQuestion: 'QX' };
            sinon.stub(Question, 'findById').resolves(mockQuestion);

            const result = await questionService.getQuestion('q1');
            expect(result).to.equal(mockQuestion);
        });

        it('should throw error if question not found', async () => {
            sinon.stub(Question, 'findById').resolves(null);

            await expect(questionService.getQuestion('qNotFound')).to.be.rejectedWith('Question not found');
        });
    });

    describe('editQuestion', () => {
        it('should throw error if original question not found', async () => {
            sinon.stub(Question, 'findByIdAndUpdate').resolves(null);

            await expect(questionService.editQuestion('q123', { priority: 2 }))
                .to.be.rejectedWith('Question not found');
        });

        it('should throw error if updated question not found', async () => {
            sinon.stub(Question, 'findByIdAndUpdate').resolves({});
            sinon.stub(Question, 'findById').resolves(null);

            await expect(questionService.editQuestion('q123', { priority: 2 }))
                .to.be.rejectedWith('Updated question not found');
        });

        it('should return updated question', async () => {
            const updated = { _id: 'q123', priority: 2 };
            sinon.stub(Question, 'findByIdAndUpdate').resolves({});
            sinon.stub(Question, 'findById').resolves(updated);

            const result = await questionService.editQuestion('q123', { priority: 2 });
            expect(result).to.deep.equal(updated);
        });
    });

    describe('deleteQuestion', () => {
        it('should call findByIdAndDelete', async () => {
            const stub = sinon.stub(Question, 'findByIdAndDelete').resolves();

            await questionService.deleteQuestion('q456');
            expect(stub.calledOnceWith('q456')).to.be.true;
        });
    });

    describe('deleteQuestionsByBankId', () => {
        it('should delete all questions with matching bankId', async () => {
            const deleteResult = { deletedCount: 3 };
            sinon.stub(Question, 'deleteMany').resolves(deleteResult);

            const result = await questionService.deleteQuestionsByBankId('bank123');
            expect(result).to.equal(`Number of questions deleted ${deleteResult}`);
        });
    });
});
