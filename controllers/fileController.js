const prisma = require('../models/queries');
const download = require('../modules/download');

const getFile = (req, res) => {
  const file = prisma.getFile(+req.params.file);
  const folder = prisma.getFolderById(+req.params.folder);
  Promise.all([file, folder]).then((values) => {
    if (values[1].userId !== req.user.id) {
      throw new Error('Unauthorized to access the file.');
    }
    return res.render('file', { file: values[0], folder: values[1] });
  });
};

const postFile = async (req, res) => {
  download(req.body.url, res);
};

module.exports = { getFile, postFile };
