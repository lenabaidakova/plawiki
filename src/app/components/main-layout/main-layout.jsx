import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Page, { Page__Header } from 'app/components/page';

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
          {toc}
        </aside>

        <main className="page__main">
          {
            loading && <span>loading</span>
          }

          {
            !loading && (
              <Fragment>{children}</Fragment>
            )
          }
        </main>

        <footer
          className="page__footer"
          hidden={isMobileMenuOpen}
        >Footer</footer>
      </Page>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.node,
};
