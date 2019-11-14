'use strict';
const packageConfig = require('../package');
const replace = require('replace-in-file');
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.dev');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const printBuildError = require('react-dev-utils/printBuildError');

const useYarn = fs.existsSync(paths.yarnLockFile);

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appContentJs])) {
  process.exit(1);
}

  fs.emptyDirSync(paths.appBuild);
  // Merge with the public folder
  copyPublicFolder();
  // Merge locale files
  copyLocaleFolder();
  // Start the webpack build
  build()
  .then(
    ({ stats, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      // console.log('File sizes after gzip:\n');
      // // printFileSizesAfterBuild(
      // //   stats,
      // //   previousFileSizes,
      // //   paths.appBuild,
      // //   WARN_AFTER_BUNDLE_GZIP_SIZE,
      // //   WARN_AFTER_CHUNK_GZIP_SIZE
      // // );
      // console.log();

      // const appPackage = require(paths.appPackageJson);
      // const publicUrl = paths.publicUrl;
      // const publicPath = config.output.publicPath;
      // const buildFolder = path.relative(process.cwd(), paths.appBuild);
      // printHostingInstructions(
      //   appPackage,
      //   publicUrl,
      //   publicPath,
      //   buildFolder,
      //   useYarn
      // );
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    }
  );

// Create the production build and print the deployment instructions.
function build() {
  console.log('Creating an unoptimized development build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        stats,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
  try {
    let changedFiles = replace.sync({
      files: paths.appBuild+"/manifest.json",
      from: "--VERSION--",
      to: packageConfig.version
    });
    console.log('Modified files:', changedFiles.map(x=>x.file).join(', '));
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}
function copyLocaleFolder() {
  fs.copySync(paths.locale, paths.applocale, {
    dereference: true,
  });
}
