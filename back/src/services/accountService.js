const Account = require('../models/Account.js');
const Guardian = require('../models/Guardian.js');
const Kid = require('../models/Kid.js');
const Session = require('../models/Session.js');
const Bank = require('../models/Bank.js');
const Reward = require('../models/Reward.js');
const Question = require('../models/Question.js');

const bcrypt = require('bcrypt');

exports.checkPassword =  async (password, accountId) => {
    const account = await Account.findById(accountId).select('+password');
    if (!account) throw new Error('Account not found');

    return await bcrypt.compare(password, account.password);
}

exports.deleteAccount = async (accountId) => {
    const account = await Account.findById(accountId);
    if (!account) throw new Error('Account not found');

    const guardianId = account.guardianId;

    // Delete related sessions and rewards
    await Session.deleteMany({ accountId });
    await Reward.deleteMany({ guardianId });

    // Delete banks and collect their IDs
    const banks = await Bank.find({ guardianId });
    const bankIds = banks.map(bank => bank._id);
    await Bank.deleteMany({ guardianId });

    // Delete all questions belonging to those banks
    await Question.deleteMany({ bankId: { $in: bankIds } });

    // Delete kid and guardian profiles
    await Kid.findOneAndDelete({ guardianId });
    await Guardian.findByIdAndDelete(guardianId);

    // Delete account
    await Account.findByIdAndDelete(accountId);

    return true;

}

