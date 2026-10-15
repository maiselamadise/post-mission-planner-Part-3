const router = require('express').Router();
const controller = require('../controllers/financialGoals');
const requireAuth = require('../middleware/requireAuth');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', controller.getAll);
router.get('/:id', validateObjectId, controller.getOne);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, validateObjectId, controller.update);
router.delete('/:id', requireAuth, validateObjectId, controller.remove);

module.exports = router;
