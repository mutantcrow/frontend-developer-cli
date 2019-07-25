/**
 * @arg {string} fileName
 * @arg {array} extensions
 * @return {boolean | string} returns file extension.
 * returns false if not allowed extension.
 */
module.exports.getValidExtension = (fileName, extensions) => {
  const len = extensions.length;
  for (let i = 0; i < len; i++) {
    const extension = extensions[i];
    if (fileName.search('.' + extension) !== -1) {
      return extension;
    }
  }
  return false;
};
