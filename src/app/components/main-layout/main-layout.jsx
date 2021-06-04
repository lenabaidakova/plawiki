import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Page, { Page__Header } from 'app/components/page';

import SVGIcon from 'app/components/svg-icon';

import scrollToAnchor from 'app/utils/scroll-to-anchor';

export default class MainLayout extends React.PureComponent {
  state = {
    isMobileMenuOpen: false,
  };

  componentDidUpdate() {
    scrollToAnchor();
  }

  handleToggleMobileMenu = () => {
    this.setState(prevState => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
    }))
  };

  render() {
    const { children, toc, mods: { loading} } = this.props;
    const { isMobileMenuOpen } = this.state;

    return (
      <Page mods={{ loading }}>
        <Page__Header
          onToggleMobileMenu={this.handleToggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />

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
            !loading && (
              <main className="page__main" aria-hidden={isMobileMenuOpen}>{children}</main>
            )
          }
        </main>

        {
          loading && <SVGIcon mods={{ type: 'preloader' }} mix="page__preloader" width="60px" height="60px"/>
        }

        <footer
          className="page__footer"
          aria-hidden={isMobileMenuOpen}
        >Footer</footer>
      </Page>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.node,
};
