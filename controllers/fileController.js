const prisma = require('../models/queries');
const { createWriteStream, unlink } = require('fs');
const https = require('https');

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
  https.get(req.body.url, (response) => {
    const fileName = req.body.url.split('/').pop();
    const filePath = './public/assets/' + fileName;
    const writeStream = createWriteStream(filePath);
    response.pipe(writeStream);
    writeStream.on('finish', () => {
      writeStream.close();
      res.download(filePath, fileName, (err) => {
        if (err) console.err(err);
        unlink(filePath, (err) => {
          if (err) console.err(err);
        });
      });
    });
  });
};

module.exports = { getFile, postFile };
