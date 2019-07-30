const {writeJSONSync, copyFileSync} = require('fs-extra');
const execSync = require('child_process').execSync;

module.exports = ({inputFileName, inputFileExtension}, {
  outputPath,
  outputFileName,
  cssExtract,
  cssPath,
  cssFileName,
  useBrowserSync,
  browserSyncServer,
  proxy,
  server,
  mainNodeModulesPath,
}) => {
  const input = inputFileName;
  const output = `${outputPath}/${outputFileName}`;
  let cssOutput = false;

  if (inputFileExtension === 'scss') {
    cssOutput = true;
  } else if (cssExtract) {
    cssOutput = `${cssPath}/${cssFileName}`;
  }

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

  if (proxy || server) devDependencies.push('browser-sync');

  const packageJSON = {
    input,
    output,
    cssOutput,
    mainNodeModulesPath,
    useBrowserSync,
    browserSyncServer,
    proxy,
    server,
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
    'npm run start',
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
