import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Page, { Page__Header } from 'app/components/page';

import SVGIcon from 'app/components/svg-icon';
import Search from 'app/components/search';
import Error from 'app/components/error';

import scrollToAnchor from 'app/utils/scroll-to-anchor';

export default class MainLayout extends React.PureComponent {
  state = {
    isMobileMenuOpen: false,
    isMobileSearchVisible: false,
  };

  componentDidUpdate() {
    scrollToAnchor();
  }

  handleToggleMobileMenu = () => {
    this.setState(prevState => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
    }))
  };

  handleToggleSearch = () => {
    this.setState(prevState => ({
      isMobileSearchVisible: !prevState.isMobileSearchVisible,
      isMobileMenuOpen: false,
    }))
  };

  render() {
    const { children, toc, mods: { loading }, error } = this.props;
    const { isMobileMenuOpen, isMobileSearchVisible } = this.state;

    return (
      <Page mods={{ loading, error: !!error }}>
        <Page__Header
          onToggleMobileMenu={this.handleToggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleSearch={this.handleToggleSearch}
        />

        <Search mix={b('page__search', {}, { visible: isMobileSearchVisible })}/>

        <aside className={b('page__aside', {}, { visible: isMobileMenuOpen })}>
          {
            !loading && (
              <nav aria-label="Main menu">
                {toc}
              </nav>
            )
          }
        </aside>

        <main className="page__main" aria-hidden={isMobileMenuOpen}>
          {
            !!error.info && <Error mix="page__error" info={error.info} status={error.status}/>
          }

          {
            !loading && !error.info && (
              <Fragment>{children}</Fragment>
            )
          }
        </main>

        {
          loading && <SVGIcon mods={{ type: 'preloader' }} mix="page__preloader" width="60px" height="60px"/>
        }
      </Page>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.node,
  toc: PropTypes.node,
  error: PropTypes.shape({
    status: PropTypes.number,
    info: PropTypes.string,
  }),
  mods: PropTypes.shape({
    loading: PropTypes.bool,
  }),
};
