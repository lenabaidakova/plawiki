import React from 'react';
import { hot } from 'react-hot-loader/root';

import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import ScrollToTop from 'app/components/scroll-to-top';

import Main from 'app/views/main';
import Article from 'app/views/article';

const AppStates = () => (
  <BrowserRouter>
    <ScrollToTop/>

    <Switch>
      <Route exact component={Main} path="/"/>

      <Route component={Article} path="/wiki/:title"/>

      {/* Redirect to the main page */}
      <Redirect to="/"/>
    </Switch>
  </BrowserRouter>
);

export default ENV === 'development' ? hot(AppStates) : AppStates;
