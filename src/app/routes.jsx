import React from 'react';
import { hot } from 'react-hot-loader/root';

import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import ScrollToTop from 'app/components/scroll-to-top';

import Article from 'app/views/article';

const AppStates = () => (
  <BrowserRouter>
    <ScrollToTop/>

    <Switch>
      <Route component={Article} path="/wiki/:title"/>

      {/* Redirect to the main page */}
      <Redirect to="/wiki/Main_Page"/>
    </Switch>
  </BrowserRouter>
);

export default ENV === 'development' ? hot(AppStates) : AppStates;
