const { createWriteStream, unlink } = require('fs');
const https = require('https');

const downloadFile = (url, res) => {
  https.get(url, (response) => {
    const fileName = url.split('/').pop();
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

module.exports = downloadFile;
