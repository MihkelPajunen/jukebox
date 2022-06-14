/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const busboy = require('busboy');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

router.post('/', (request, response) => {
  const bb = busboy({ headers: request.headers });

  const fields = {};

  bb.on('field', (name, value) => (fields[name] = value));

  const fileObject = {};

  bb.on('file', (_name, file, info) => {
    fileObject['mimeType'] = info.mimeType;

    if (!['audio/flac', 'audio/x-flac'].includes(fileObject.mimeType)) {
      request.unpipe(bb);
      response.writeHead(415, { Connection: 'close' });
      response.end();
    }

    fileObject['filePath'] = path.join(os.tmpdir(), `${uuidv4()}.flac`);
    fileObject['fileSize'] = 0;

    const stream = fs.createWriteStream(fileObject.filePath);

    file.on('data', (data) => {
      stream.write(data);
      fileObject.fileSize += data.length;
    });

    file.on('end', () => stream.close());
  });

  bb.on('error', () => {
    request.unpipe(bb);
    response.writeHead(500, { Connection: 'close' });
    response.end();
  });

  bb.on('close', () => response.status(200).json({ success: true }));

  request.pipe(bb);
});

module.exports = router;
