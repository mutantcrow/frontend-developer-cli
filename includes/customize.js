const {writeJSONSync, copyFileSync} = require('fs-extra');
const execSync = require('child_process').execSync;

module.exports = (input, output, css, proxy) => {
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

  const packageJSON = {
    input,
    output,
    proxy,
    css,
    scripts: {
      start: 'rollup -c -w',
      build: 'rollup -c --environment production',
      link: 'npm link ' + devDependencies.join(' '),
    },
  };

  writeJSONSync('./package.json', packageJSON, {spaces: 2});

  copyFileSync(__dirname + '/../configs/rollup.config.js',
      './rollup.config.js');

  runScripts([
    'npm run link',
    'npm run build',
  ]);
};

/**
 * Runs npm scripts.
 * @arg {array} nodeScripts
 */
function runScripts(nodeScripts) {
  const len = nodeScripts.length;

  for (let i = 0; i < len; i++) {
    const task = nodeScripts[i];
    execSync(task, {stdio: 'inherit'});
  }
}