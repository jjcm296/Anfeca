const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

console.log('typeof chaiAsPromised:', typeof chaiAsPromised);

chai.use(chaiAsPromised);
console.log('chai-as-promised loaded without crashing ✅');
