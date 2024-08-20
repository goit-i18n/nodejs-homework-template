const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const processAvatar = async (filePath, destPath) => {
  const image = await Jimp.read(filePath);
  await image.resize(250, 250).writeAsync(destPath);
};

module.exports = processAvatar;
