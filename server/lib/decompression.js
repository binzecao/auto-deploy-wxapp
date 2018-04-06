var fs = require('fs');
var Utility = require('./utility');
var decompress = require('decompress');

/*
// https://www.npmjs.com/package/decompress
decompress(input, [output], [options])
return 
  {
      data: Buffer,
      mode: Number,
      mtime: String,
      path: String,
      type: String
  }
*/

async function doDecompress(filePath, outputDir) {
  // return await decompress(filePath, outputDir);

  // console.log('filePath: ' + filePath, 'outputDir: ' + outputDir);
  return new Promise((resolve, reject) => {
    if (!filePath) {
      reject('File path can not be empty.');
      return;
    }

    if (!outputDir) {
      reject('Output dir can not be not empty.');
      return;
    }

    try {
      Utility.mkdirsSync(outputDir);
    } catch (ex) {
      reject(ex + '');
      return;
    }

    if (!fs.existsSync(filePath)) {
      reject('File is not exists, can not to decompress.');
      return;
    }

    if (!fs.existsSync(outputDir) || !fs.statSync(outputDir).isDirectory()) {
      reject('Output dir is not exists');
      return;
    }

    decompress(filePath, outputDir).then(files => {
      resolve('Decompress successfully!');
    }).catch(err => {
      reject('Decompress error, perhaps the path is unvalid!', err);
    });
  });
}

module.exports.decompress = doDecompress;
