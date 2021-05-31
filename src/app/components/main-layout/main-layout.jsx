import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Page, { Page__Header } from 'app/components/page';
import Autocomplete from 'app/components/autocomplete';

import scrollToAnchor from 'app/utils/scroll-to-anchor';

export default class MainLayout extends React.PureComponent {
  state = {
    value: '',
    searchList: [],
    isMobileMenuOpen: false,
    isMobileSearchVisible: false,
  };

  componentDidUpdate() {
    scrollToAnchor();
  }

  onChange = value => this.setState({ value }, this.onSearch);

  onSearch = () => {
    const { value } = this.state;

    if (!value) {
      this.setState({ searchList: []});

      return;
    }

    // https://www.mediawiki.org/w/api.php?action=opensearch&origin=*&search=Nelson
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=prefixsearch&pssearch=${value}`)
      .then(response => response.json())
      .then(data => this.setState({ searchList: data.query.prefixsearch}))
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.onSearch();
  };

  onToggleMobileMenu = () => {
    this.setState(prevState => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
      isMobileSearchVisible: false,
    }))
  };

  onToggleMobileSearch = () => {
    this.setState(prevState => ({
      isMobileSearchVisible: !prevState.isMobileSearchVisible,
      isMobileMenuOpen: false,
    }));
  };

  render() {
    const { children, toc, mods: { loading} } = this.props;
    const { searchList, value, isMobileMenuOpen, isMobileSearchVisible } = this.state;

    return (
      <Page mods={{ loading }}>
        <Page__Header
          onToggleMobileMenu={this.onToggleMobileMenu}
          onToggleMobileSearch={this.onToggleMobileSearch}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <form
          className={b('page__search', {}, { visible: isMobileSearchVisible })}
          onSubmit={this.onSubmit}
        >
          <Autocomplete
            onChange={this.onChange}
            onSearch={this.onSearch}
            value={value}
            list={searchList}
          />
        </form>

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
