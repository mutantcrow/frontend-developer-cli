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
const chalk = require('chalk');
const fs = require('fs');
const global = {};

/**
 * Start Asking Questions
 * and process answers
 * customize rollup-js
 */
inquirer.prompt([
  {
    type: 'list',
    name: 'inputFile',
    message: 'Select input file: ',
    choices: fs.readdirSync(process.cwd()),
  },
  {
    type: 'input',
    name: 'outputPath',
    message: 'Enter the output file path: ',
    default: '../dist',
    filter: utils.addLastSlash,
    when: ({inputFile}) => {
      global.inputFileExtension = utils.getValidExtension(inputFile,
          ['js', 'scss']);

      if ( global.inputFileExtension) {
        return true;
      } else {
        console.log(chalk.bgRed.bold('Input file is not javascript or sass.'));
        process.exit();
      }
    },
  },
  {
    type: 'input',
    name: 'outputFile',
    message: 'Enter a output file name: ',
    default: ({inputFile}) => {
      global.inputFileName = inputFile.split(/(\.js|\.scss)$/)[0];
      return global.inputFileName;
    },
    filter: (userInput) => {
      switch (global.inputFileExtension) {
        case 'js':
          return userInput + '.js';

        case 'scss':
          return userInput + '.css';
      }
    },
  },
  {
    type: 'list',
    name: 'outputFormat',
    message: 'Enter a output format: ',
    choices: ['esm', 'iife', 'umd', 'cjs', 'amd'],
  },
  {
    type: 'confirm',
    name: 'extractCSS',
    message: 'Should imported css is to be extracted?',
    default: false,
    when: ({inputFile}) => inputFile.search(/\.js/) !== -1,
  },
  {
    type: 'input',
    name: 'cssPath',
    message: 'Please enter css extraction path: ',
    default: ({outputPath}) => outputPath,
    filter: utils.addLastSlash,
    when: ({extractCSS}) => extractCSS,
  },
  {
    type: 'input',
    name: 'cssFile',
    message: 'Please enter a name for css file: ',
    default: ({inputFile}) => inputFile.split(/\.js/)[0],
    filter: (userInput) => userInput + '.css',
    when: ({extractCSS}) => extractCSS,
  },
  {
    type: 'input',
    name: 'mainNodeModulesPath',
    message: 'Please enter a path for main >>PATH<</node_modules: ',
    default: './',
    filter: (userInput) => utils.addLastSlash(userInput) + 'node_modules',
  },
  {
    type: 'confirm',
    name: 'useBrowserSync',
    message: 'Will BrowserSync be used?',
    default: true,
  },
  {
    type: 'list',
    name: 'browserSyncSelect',
    message: 'Choose server type: ',
    choices: [
      'Use proxy',
      'Use server',
    ],
    when: ({useBrowserSync}) => useBrowserSync,
  },
  {
    type: 'input',
    name: 'browserSyncSelection',
    message: 'Please enter proxy address: ',
    default: 'localhost',
    filter: (userInput) => {
      if (userInput.search('http') === -1) return 'http://' + userInput;
      return userInput;
    },
    when: ({browserSyncSelect}) => browserSyncSelect === 'Use proxy',
  },
  {
    type: 'input',
    name: 'browserSyncSelection',
    message: 'Please enter server folder path: ',
    default: './public',
    filter: utils.addLastSlash,
    when: ({browserSyncSelect}) => browserSyncSelect === 'Use server',
  },
]).then((answers) => {
  customize(answers);

  console.log(
      chalk.bgGreen(`Build tools generated for "${answers.inputFile}".`)
  );
});
