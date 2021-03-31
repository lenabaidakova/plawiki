import React from 'react';
import { hot } from 'react-hot-loader/root';

import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

import ScrollToTop from 'app/components/scroll-to-top';
import RouteMain from 'app/components/route-main';

import Main from 'app/views/main';
import Secondary from 'app/views/secondary';

const AppStates = () => (
  <BrowserRouter>
    <ScrollToTop/>

    <Switch>
      <RouteMain exact component={Main} path="/"/>

      <RouteMain exact component={Secondary} path="/secondary"/>

      {/* Redirect to the main page */}
      <Redirect to="/"/>
    </Switch>
  </BrowserRouter>
);

export default ENV === 'development' ? hot(AppStates) : AppStates;
