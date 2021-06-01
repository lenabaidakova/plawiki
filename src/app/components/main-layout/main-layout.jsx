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

  onToggleMobileMenu = () => {
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
          onToggleMobileMenu={this.onToggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <aside className={b('page__aside', {}, { visible: isMobileMenuOpen })}>
          <nav aria-label="Main menu">
            {toc}
          </nav>
        </aside>

        <main className="page__main" aria-hidden={isMobileMenuOpen}>
          {
            loading && <SVGIcon mods={{ type: 'preloader' }} width="60px"/>
          }

          {
            !loading && (
              <Fragment>{children}</Fragment>
            )
          }
        </main>

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
