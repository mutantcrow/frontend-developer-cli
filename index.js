#! /usr/bin/env node

/**
 * Dependencies
 * @const inquirer generates questions.
 * @const customize modifies rollup config
 * according to inquirer's answers.
 * @const utils helper functions.
 */
const inquirer = require('inquirer');
const customize = require('./includes/customize');
const utils = require('./includes/utils');

/**
 * @const cwd  Get current working directory path.
 * @const inputFileName  Get input file name.
 * @const inputFileExtension Must be js or scss.
 */
const cwd = process.cwd();
const inputFileName = process.argv.slice(2)[0];
const inputFileExtension = utils.getValidExtension(inputFileName,
    ['js', 'css']);

/**
 * Check if input file extension is valid.
 */
if (inputFileExtension === false) {
  console.log('Input file is not javascript or sass.');
  return;
}

/**
 * @const inputFileBaseName Removed extension from the file name.
 */
const inputFileBaseName = inputFileName.split(/(\.js|\.scss)/)[0];

/**
 * Start Asking Questions
 * and process answers
 * customize rollup-js
 */
inquirer.prompt([
  {
    type: 'input',
    name: 'outputPath',
    message: 'Enter the output file path: ',
    default: `${cwd}/../dist/`,
  },
  {
    type: 'input',
    name: 'outputFileName',
    message: 'Enter a output file name: ',
    default: () => {
      switch (inputFileExtension) {
        case 'js':
          return inputFileBaseName + '.js';

        case 'scss':
          return inputFileBaseName + '.css';
      }
    },
    validate: (userInput) => {
      if (utils.getValidExtension(userInput, ['js', 'css'])) {
        return true;
      }
      return `Output file extension needs to be js or css.`;
    },
  },
  {
    type: 'confirm',
    name: 'cssExtract',
    message: 'Should imported css is to be extracted?',
    default: false,
    when: inputFileExtension === 'js',
  },
  {
    type: 'input',
    name: 'cssPath',
    message: 'Please enter css extraction path: ',
    default: `${cwd}/../dist/`,
    when: ({cssExtract}) => cssExtract && inputFileExtension === 'js',
  },
  {
    type: 'input',
    name: 'cssFileName',
    message: 'Please enter a name for css file: ',
    default: `${inputFileBaseName}.css`,
    when: ({cssExtract}) => cssExtract && inputFileExtension === 'js',
  },
  {
    type: 'input',
    name: 'mainNodeModulesPath',
    message: 'Please enter a path for main >>PATH<</node_modules: ',
    default: './',
    filter: (userInput) => {
      return userInput + 'node_modules';
    },
  },
  {
    type: 'confirm',
    name: 'browsersync',
    message: 'Will browsersync be used?',
    default: true,
  },
  {
    type: 'input',
    name: 'proxy',
    message: 'Please enter proxy addres: ',
    default: false,
    filter: (userInput) => {
      return 'http://' + userInput;
    },
    when: ({browsersync}) => {
      return browsersync;
    },
  },
]).then(({
  outputPath,
  outputFileName,
  cssExtract,
  cssPath,
  cssFileName,
  proxy,
  mainNodeModulesPath,
}) => {
  const input = `${cwd}/${inputFileName}`;
  const output = `${outputPath}/${outputFileName}`;
  let css = false;

  if (inputFileExtension === 'scss') {
    css = true;
  } else if (cssExtract) {
    css = `${cssPath}/${cssFileName}`;
  }

  customize(input, output, css, proxy, mainNodeModulesPath);

  console.log(
      '\033[32m',
      `Build tools generated for ${inputFileName}.`,
      '\x1b[0m');
});
