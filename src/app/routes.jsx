import React from 'react';
import { hot } from 'react-hot-loader/root';

import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import ScrollToTop from 'app/components/scroll-to-top';

import Article from 'app/views/article';
import Sandbox from 'app/views/sandbox';
import SearchResult from 'app/views/search-result';

const AppStates = () => (
  <BrowserRouter>
    <ScrollToTop/>

    <Switch>
      <Route component={Article} path="/wiki/:title"/>
      <Route component={SearchResult} path="/search/:title"/>
      <Route component={Sandbox} path="/sandbox"/>

      {/* Redirect to the main page */}
      <Redirect to="/wiki/Main_Page"/>
    </Switch>
  </BrowserRouter>
);

export default ENV === 'development' ? hot(AppStates) : AppStates;
