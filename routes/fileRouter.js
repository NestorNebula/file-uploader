const { Router } = require('express');
const fileRouter = Router();
const fileController = require('../controllers/fileController');

fileRouter.get('/', fileController.getFile);
fileRouter.post('/', fileController.postFile);

module.exports = fileRouter;
