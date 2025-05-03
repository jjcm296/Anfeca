const Bank = require('../models/Bank.js');
const questionService =  require('./questionService.js');

exports.getAllBanks = async ( guardianId ) => {

    const banks = await Bank.find({ guardianId });

    return banks;

};

exports.createBank = async ({ name, guardianId  }) => {

    const bankDuplicated = await Bank.find({ name: name, guardianId: guardianId });

    if (bankDuplicated.length > 0) {
        throw new Error('You already have a bank named like that');
    }

    await Bank.create({ name, guardianId })

    const createdBank = await Bank.findOne({ name, guardianId}).lean();

    return createdBank;
};

exports.getBank = async (bankId) => {

    const bank = await Bank.findById(bankId);

    if(!bank) throw new Error("Bank not found in the database")

    return bank;
};

exports.editBank = async (bankId, updatedFields) => {

    const bank = await Bank.findByIdAndUpdate(bankId, updatedFields);

    if (!bank) throw new Error("Bank not found");

    const updatedBank = await Bank.findById(bankId);

    if (!updatedBank) throw new Error("Updated bank not found");

    return updatedBank;

};

exports.deleteBank = async (bankId) => {

    await Bank.findByIdAndDelete(bankId);

    await questionService.deleteQuestionsByBankId(bankId);

};

