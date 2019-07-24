const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const {uglify} = require('rollup-plugin-uglify');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
let browsersync = undefined;

const {input, output, css, proxy} = require('./package.json');
const isProduction = process.env.production ? true : false;

const postcssOptions = {
  extract: css,
  plugins: [autoprefixer()],
  minimize: isProduction,
  sourceMap: !isProduction,
};

if (proxy) browsersync = require('rollup-plugin-browsersync');

const browsersyncOptions = {
  ui: false,
  notify: false,
  proxy,
};

module.exports = {
  input: input,
  output: {
    file: output,
    format: 'cjs',
  },
  watch: {exclude: 'node_modules/**'},
  plugins: [
    resolve(),
    commonjs(),
    babel({exclude: 'node_modules/**'}),
    isProduction ? uglify() : '',
    postcss(postcssOptions),
    !isProduction && proxy ? browsersync(browsersyncOptions) : '',
  ],
};
