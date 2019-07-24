#! /usr/bin/env node

/**
 * Dependencies
 */
const inquirer = require('inquirer');
const customize = require('./includes/customize');
const {getValidFileExtension} = require('./includes/functions');

/**
 * Get current directory path.
 * Get input file name.
 * Get input file extension.
 */
const cwd = process.cwd();
const inputFileName = process.argv.slice(2)[0];
const inputFileExtension = getValidFileExtension(inputFileName);

/**
 * Check if input file is valid.
 */
if (inputFileExtension === false) {
  console.log('Input file is not javascript.');
  return;
}

/**
 * Start Asking Questions
 */
inquirer
    .prompt([
      {
        type: 'input',
        name: 'outputPath',
        message: 'Enter the output file path: ',
        default: `${cwd}/dist/`,
      },
      {
        type: 'input',
        name: 'outputFileName',
        message: 'Enter the output file path: ',
        default: inputFileName,
        validate: (userInput) => {
          if (getValidFileExtension(userInput)) {
            return true;
          }
          return 'Output file extension needs to be js.';
        },
      },
      {
        type: 'confirm',
        name: 'extractCSS',
        message: 'Should imported css is to be extracted?',
        default: false,
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
    ])
    .then((answers) => {
      startProcess(answers);
    });

/**
 * Process answers
 */
function startProcess({outputPath, outputFileName, extractCSS, proxy}) {
  const input = `${cwd}/${inputFileName}`;
  const output = `${outputPath}/${outputFileName}`;

  customize(input, output, extractCSS, proxy);

  console.log(
      '\033[32m',
      `Build tools generated for ${inputFileName}.`,
      '\x1b[0m');
}
