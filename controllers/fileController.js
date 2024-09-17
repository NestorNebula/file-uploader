const prisma = require('../models/queries');
const { createWriteStream, unlink } = require('fs');
const { Readable } = require('stream');

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
  const filePath = './public/' + req.body.url.split('/').pop();
  const file = await fetch(req.body.url, { mode: 'cors' });
  let writer = createWriteStream(filePath);
  Readable.fromWeb(file.body).pipe(writer);
  writer.on('finish', () => {
    writer.close();
    res.download(filePath, 'secondtest.png', (err) => {
      if (err) console.err(err);
      unlink(filePath, (err) => {
        if (err) throw err;
      });
    });
  });
};

module.exports = { getFile, postFile };
