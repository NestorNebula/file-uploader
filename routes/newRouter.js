const { Router } = require('express');
const newRouter = Router();
const newController = require('../controllers/newController');
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });

newRouter.get('/', newController.getNew);
newRouter.post('/', upload.single('ufile'), newController.postNew);

module.exports = newRouter;
