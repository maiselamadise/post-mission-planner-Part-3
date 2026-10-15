const FinancialGoal = require('../models/FinancialGoal');
module.exports = require('./crudController')(FinancialGoal, 'Financial goal');
