module.exports.getValidFileExtension = (userInput) => {
  if (userInput.search('.js') !== -1) {
    return 'js';
  }
  return false;
};
