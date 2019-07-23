module.exports.getValidFileExtension = (userInput) => {
  if (userInput.search('.js') !== -1) {
    return 'js';
  } else if (userInput.search('.scss') !== -1) {
    return 'scss';
  }
  return false;
}