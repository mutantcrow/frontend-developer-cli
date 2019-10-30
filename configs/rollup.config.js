/**
 * Dependencies
 */
import del from 'rollup-plugin-delete';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import atImport from 'postcss-import';
import copy from 'postcss-copy';
import autoprefixer from 'autoprefixer';

/**
 * @const isProduction is a argument in "npm run build" script
 * from package.json and is used for rollup-js config conditionals.
 */
const isProduction = process.env.production ? true : false;

/**
 * Gets necessary package.json's properties for.
 */
const {
  inputFile,
  outputPath,
  outputFile,
  outputFormat,
  extractCSS,
  cssPath,
  cssFile,
  mainNodeModulesPath,
  useBrowserSync,
  browserSyncSelect,
  browserSyncSelection,
  excludedDependencies,
} = require('./package.json');

/**
 * Del Options
 */
const delOptions = {
  targets: [
    outputPath + outputFile + '*',
    cssPath + cssFile + '*',
  ],
  force: true,
};

/**
 * Postcss Options
 */
const postcssOptions = {
  extract: extractCSS === undefined ? true :
  (cssPath ? `${cssPath + cssFile}` : false),
  plugins: [
    atImport,
    autoprefixer,
    copy({
      basePath: ['./', mainNodeModulesPath],
      dest: cssPath || outputPath,
      template: '[name]-[hash].[ext]',
    }),
  ],
  minimize: isProduction,
  sourceMap: !isProduction,
  use: [['sass', {includePaths: [mainNodeModulesPath]}]],
};

/**
 * Babel Options
 */
const babelOptions = {
  babelrc: false,
  presets: [
    ['@babel/env', {modules: false}],
  ],
  plugins: ['@babel/plugin-syntax-dynamic-import'],
  exclude: mainNodeModulesPath,
};

if (useBrowserSync) {
  const browserSync = require('browser-sync').create();

  /**
   * BrowserSync Options
   */
  const browserSyncOptions = {
    ui: false,
    notify: false,
    watch: true,
    files: [outputPath],
  };

  switch (browserSyncSelect) {
    case 'Use proxy':
      browserSyncOptions.proxy = browserSyncSelection;
      break;

    case 'Use server':
      browserSyncOptions.server = browserSyncSelection;
      break;
  }

  /**
   * Start browser-sync
   */
  if (!isProduction) browserSync.init(browserSyncOptions);
}

/**
 * Rollup-js config
 */
export default {
  input: inputFile,
  output: {
    dir: outputPath,
    entryFileNames: outputFile,
    format: outputFormat,
    sourcemap: !isProduction,
  },
  external: excludedDependencies,
  watch: {exclude: mainNodeModulesPath},
  plugins: [
    isProduction ? del(delOptions) : '',
    resolve(),
    commonjs(),
    babel(babelOptions),
    isProduction ? terser() : '',
    postcss(postcssOptions),
  ],
};
