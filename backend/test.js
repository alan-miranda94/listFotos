const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// This method will save the binary content of the request as a file.
app.patch('/binary-upload', (req, res) => {
  req.pipe(fs.createWriteStream('./uploads/image' + Date.now() + '.png'));
  res.end('OK');
});

// This method will save a "photo" field from the request as a file.
app.patch('/multipart-upload', upload.single('photo'), (req, res) => {
  // You can access other HTTP parameters. They are located in the body object.
  console.log(req.body);
  res.end('OK');
});

app.listen(3000, () => {
  console.log('Working on port 3000');
})