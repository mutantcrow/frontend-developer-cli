/**
 * Dependencies
 */
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const {uglify} = require('rollup-plugin-uglify');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');

/**
 * @const isProduction is a argument in "npm run build" script
 * from package.json and is used for rollup-js config conditionals.
 */
const isProduction = process.env.production ? true : false;

/**
 * Gets necessary package.json's properties for.
 */
const {
  input,
  output,
  css,
  proxy,
  mainNodeModulesPath,
} = require('./package.json');

/**
 * Postcss Options
 */
const postcssOptions = {
  extract: css,
  plugins: [autoprefixer()],
  minimize: isProduction,
  sourceMap: !isProduction,
  use: [
    ['sass', {
      includePaths: [mainNodeModulesPath],
    }],
  ],
};

/**
 * Conditional Dependencies
 */
let browsersync = undefined;
if (proxy) browsersync = require('rollup-plugin-browsersync');

/**
 * BrowserSync Options
 */
const browsersyncOptions = {
  ui: false,
  notify: false,
  proxy,
};

/**
 * Rollup-js config
 */
module.exports = {
  input: input,
  output: {
    file: output,
    format: 'cjs',
  },
  watch: {exclude: `${mainNodeModulesPath}/**`},
  plugins: [
    resolve(),
    commonjs(),
    babel({exclude: `${mainNodeModulesPath}/**`}),
    isProduction ? uglify() : '',
    postcss(postcssOptions),
    !isProduction && proxy ? browsersync(browsersyncOptions) : '',
  ],
};
