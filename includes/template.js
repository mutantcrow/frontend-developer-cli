const {writeJSONSync, copyFileSync} = require('fs-extra');
const execSync = require('child_process').execSync;
const packageJSON = require('../templates/package.json');

module.exports.javascript = (input, output) => {
  packageJSON.input = input;
  packageJSON.output = output;
  packageJSON.scripts.start = 'rollup -c -w';
  packageJSON.scripts.build = 'rollup -c --environment production';

  writeJSONSync('./package.json', packageJSON, {spaces: 2});

  copyFileSync(__dirname + '/../templates/rollup.config.js',
      './rollup.config.js');

  const devDependencies = [
    '@babel/core',
    '@babel/preset-env',
    'autoprefixer',
    'node-sass',
    'rollup-plugin-babel',
    'rollup-plugin-commonjs',
    'rollup-plugin-node-resolve',
    'rollup-plugin-browsersync',
    'rollup-plugin-postcss',
    'rollup-plugin-uglify',
  ];

  const nodeTasks = [
    'npm link ' + devDependencies.join(' '),
    'npm run build',
  ];

  const len = nodeTasks.length;
  for (let i = 0; i < len; i++) {
    const task = nodeTasks[i];
    execSync(task, {stdio: 'inherit'});
  }
};

module.exports.scss = (input, output) => {
  packageJSON.input = input;
  packageJSON.output = output;
  packageJSON.scripts.start = '';
  packageJSON.scripts.build = '';

  writeJSONSync('./package.json', packageJSON, {spaces: 2});
};

// TODO: Create gulp
// TODO: Create browsersync
