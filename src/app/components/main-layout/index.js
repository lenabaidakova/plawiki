export { default } from './main-layout';

require('./main-layout.scss');

/*
  mw module for loading modules from Wikipedia
  https://www.mediawiki.org/wiki/ResourceLoader/Core_modules
  https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
*/
require('!file-loader?name=[name].[ext]!./mw');
