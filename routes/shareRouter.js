const { Router } = require('express');
const shareRouter = Router();
const shareController = require('../controllers/shareController');

shareRouter.post('/', shareController.postShare);
shareRouter.get('/:link', shareController.getShare);
shareRouter.post('/:link/:file', shareController.downloadShare);

module.exports = shareRouter;
