// Do this as the first thing so that any code reading it knows the right env.

if(process.argv[2] !== "dev"){
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';
  process.env.ASSET_PATH = '/';
} else {
  process.env.BABEL_ENV = 'development';
  process.env.NODE_ENV = 'development';
  process.env.ASSET_PATH = '/';
}

var webpack = require('webpack'),
config = require('../webpack.config');


if(process.argv[2] !== "dev"){
  config.mode = 'production';
} else {
  config.mode = 'development';
}


delete config.chromeExtensionBoilerplate;


webpack(config, function (err) {
  if (err) throw err;
});
