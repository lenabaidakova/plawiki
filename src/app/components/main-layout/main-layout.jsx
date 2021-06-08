import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Page, { Page__Header } from 'app/components/page';

import SVGIcon from 'app/components/svg-icon';
import Search from 'app/components/search';
import Error from 'app/components/error';
import Contents from 'app/components/contents';

import scrollToAnchor from 'app/utils/scroll-to-anchor';

class MainLayout extends React.PureComponent {
  state = {
    isMobileMenuOpen: false,
    isMobileSearchVisible: false,
  };

  componentDidUpdate(prevProps) {
    const { location: currentLocation } = this.props;
    const { location: prevLocation } = prevProps;

    if (currentLocation.hash !== prevLocation.hash) {
      scrollToAnchor();
    }
  }

  handleToggleMobileMenu = () => {
    this.setState(prevState => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
      isMobileSearchVisible: false,
    }))
  };

  handleToggleSearch = () => {
    this.setState(prevState => ({
      isMobileSearchVisible: !prevState.isMobileSearchVisible,
      isMobileMenuOpen: false,
    }))
  };

  handleTocClick = () => this.setState({ isMobileMenuOpen: false });

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

        {/* todo: add autofocus when open search on mobile */}
        <Search mix={b('page__search', {}, { visible: isMobileSearchVisible })}/>

        <aside className={b('page__aside', {}, { visible: isMobileMenuOpen })}>
          {
            !loading && (
              <nav aria-label="Main menu">
                <Contents list={toc.sections} headline={toc.headline} onClick={this.handleTocClick}/>
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
  toc: PropTypes.object,
  error: PropTypes.shape({
    status: PropTypes.number,
    info: PropTypes.string,
  }),
  mods: PropTypes.shape({
    loading: PropTypes.bool,
  }),
};

export default withRouter(MainLayout);
