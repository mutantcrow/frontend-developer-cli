const {writeJSONSync, copyFileSync} = require('fs-extra');
const execSync = require('child_process').execSync;
const packageJSON = require('../templates/package.json');

module.exports.javascript = (input, output, proxy) => {
  const devDependencies = [
    '@babel/core',
    '@babel/preset-env',
    'autoprefixer',
    'node-sass',
    'rollup-plugin-babel',
    'rollup-plugin-commonjs',
    'rollup-plugin-node-resolve',
    'rollup-plugin-postcss',
    'rollup-plugin-uglify',
  ];

  if (proxy) devDependencies.push('rollup-plugin-browsersync');

  packageJSON.input = input;
  packageJSON.output = output;
  packageJSON.proxy = proxy;
  packageJSON.scripts.start = 'rollup -c -w';
  packageJSON.scripts.build = 'rollup -c --environment production';
  packageJSON.scripts.link = 'npm link ' + devDependencies.join(' ');

  writeJSONSync('./package.json', packageJSON, {spaces: 2});

  copyFileSync(__dirname + '/../templates/rollup.config.js',
      './rollup.config.js');

  runScripts();
};

module.exports.scss = (input, output) => {
  const devDependencies = [
    'gulp',
  ];

  packageJSON.input = input;
  packageJSON.output = output;
  packageJSON.scripts.start = '';
  packageJSON.scripts.build = '';
  packageJSON.scripts.link = 'npm link ' + devDependencies.join(' ');

  writeJSONSync('./package.json', packageJSON, {spaces: 2});

  // TODO: Create gulp
  // TODO: Create browsersync

  runScripts();
};

/**
 * Runs npm scripts.
 */
function runScripts() {
  const nodeScripts = [
    'npm run link',
    'npm run build',
  ];

  const len = nodeScripts.length;
  for (let i = 0; i < len; i++) {
    const task = nodeScripts[i];
    execSync(task, {stdio: 'inherit'});
  }
}
