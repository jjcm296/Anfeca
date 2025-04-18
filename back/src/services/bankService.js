const Bank = require('../models/Bank.js');
const questionService =  require('./questionService.js');

exports.getAllBanks = async ( guardianId ) => {

    const banks = await Bank.find({ guardianId });

    return banks;

}

exports.createBank = async ({ name, guardianId  }) => {

    const bank = await Bank.create({ name, guardianId })

    return bank;
}

exports.getBank = async (bankId) => {

    const bank = await Bank.findById(bankId);

    if(!bank) throw new Error("Bank not found in the database")

    return bank;
}

exports.deleteBank = async (bankId) => {

    await Bank.findByIdAndDelete(bankId);

    await questionService.deleteQuestionsByBankId(bankId);

}

