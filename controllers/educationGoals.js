const EducationGoal = require('../models/EducationGoal');
module.exports = require('./crudController')(EducationGoal, 'Education goal');
