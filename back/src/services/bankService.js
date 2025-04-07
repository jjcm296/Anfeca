const Bank = require('../models/Bank.js');

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

    return bank;
}

exports.deleteBank = async (bankId) => {

    await Bank.findByIdAndDelete(bankId);

}

