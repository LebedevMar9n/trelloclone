const { sectionController } = require('../controllers');

const router = require('express').Router();

router.post('/', sectionController.createSection);
router.get('/', sectionController.getAllSections);
router.delete('/:id', sectionController.deleteOneSection);
router.put('/:id', sectionController.updateOneSection);

module.exports = router;
