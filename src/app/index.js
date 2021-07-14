import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

/* eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member */
import Routes from 'app/routes';
import 'app/components/document';

/* eslint-disable react/jsx-filename-extension */
ReactDOM.render(
  <StrictMode>
    <Routes/>
  </StrictMode>,

  document.getElementById('root'),
);
