#! /usr/bin/env node

/**
 * Dependencies
 */
const inquirer = require('inquirer');
const template = require('./includes/template');
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
  console.log('Input file is not javascript or scss.');
  return;
}

/**
 * Start Asking Questions
 */
inquirer
    .prompt([
      {
        type: 'input',
        name: 'output',
        message: 'Enter the output file path: ',
        default: `${cwd}/output/${inputFileName}`,
        validate: (userInput) => {
          if (getValidFileExtension(userInput)) {
            return true;
          }
          return 'Output file extension needs to be js or scss.';
        },
      },
      {
        type: 'confirm',
        name: 'browsersync',
        message: 'Will browsersync be used?',
      },
      {
        type: 'input',
        name: 'proxy',
        message: 'Please enter proxy addres: ',
        default: false,
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
function startProcess({output, proxy}) {
  const input = `${cwd}/${inputFileName}`;

  switch (inputFileExtension) {
    case 'js':
      template.javascript(input, output, proxy);
      break;

    case 'scss':
      template.scss(input, output);
      break;
  }

  console.log(
      '\033[32m',
      `Build tools generated for ${inputFileName}.`,
      '\x1b[0m');
}
