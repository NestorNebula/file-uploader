const { Router } = require('express');
const userRouter = Router();
const userController = require('../controllers/userController');
const fileController = require('../controllers/fileController');

userRouter.get('/', userController);
userRouter.get('/:folder/:file', fileController.getFile);
userRouter.post('/:folder/:file', fileController.postFile);

module.exports = userRouter;
