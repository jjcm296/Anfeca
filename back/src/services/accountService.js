const Account = require('../models/Account.js');
const bcrypt = require('bcrypt');

exports.checkPassword =  async (password, accountId) => {
    const account = await Account.findById(accountId).select('+password');
    if (!account) throw new Error('Account not found');

    return await bcrypt.compare(password, account.password);
}

