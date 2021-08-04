import { lazy, Suspense } from 'react';
import { hot } from 'react-hot-loader/root';

import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import ScrollToTop from 'app/components/scroll-to-top';

const Article = lazy(() => import(/* webpackChunkName: "article-route" */ 'app/pages/article'));
const Sandbox = lazy(() => import(/* webpackChunkName: "sandbox-route" */ 'app/pages/sandbox'));
const SearchResult = lazy(() => import(/* webpackChunkName: "search-result-route" */ 'app/pages/search-result'));

const AppStates = () => (
  <BrowserRouter>
    <ScrollToTop/>

    <Suspense fallback={<h1>loading...</h1>}>
      <Switch>
        <Route component={Article} path="/wiki/:title"/>
        <Route component={SearchResult} path="/search/:title"/>
        <Route component={Sandbox} path="/sandbox"/>

        {/* Redirect to the main page */}
        <Redirect to="/wiki/Main_Page"/>
      </Switch></Suspense>
  </BrowserRouter>
);

export default process.env.NODE_ENV === 'development' ? hot(AppStates) : AppStates;
