import React from 'react';
import ReactDOM from 'react-dom';

import Routes from './routes';
import 'app/components/document';

/*
  mw module for loading modules from Wikipedia
  https://www.mediawiki.org/wiki/ResourceLoader/Core_modules
  https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
*/
import 'app/vendors/mw';

/* eslint-disable-next-line react/jsx-filename-extension */
ReactDOM.render(<Routes/>, document.getElementById('root'));
