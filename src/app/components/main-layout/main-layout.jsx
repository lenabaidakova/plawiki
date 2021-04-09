import React from 'react';
import PropTypes from 'prop-types';

import Page from 'app/components/page';
import Aside from 'app/components/aside';
import Logo from 'app/components/logo';
import Autocomplete from 'app/components/autocomplete';

import { HEADER_ID } from 'app/constants/common';

import scrollToAnchor from 'app/utils/scroll-to-anchor';

export default class MainLayout extends React.PureComponent {
  state = {
    value: '',
    searchList: [],
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

  render() {
    const { children, toc, mods: { loading} } = this.props;
    const { searchList, value } = this.state;

    return (
      <Page mods={{ loading }}>
        <Aside mix="page__aside">
          <div className="page__logo-wrapper">
            <Logo mix="page__logo"/>
          </div>

          {toc}
        </Aside>

        <div className="page__body">
          <header className="page__header" id={HEADER_ID}>
            <form onSubmit={this.onSubmit}>
              <Autocomplete
                onChange={this.onChange}
                onSearch={this.onSearch}
                value={value}
                list={searchList}
              />
            </form>
          </header>

          <main className="page__main">
            {
              loading && <span>loading</span>
            }

            {
              !loading && (
                <div>{children}</div>
              )
            }
          </main>

          <footer className="page__footer">Footer</footer>
        </div>
      </Page>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.node,
};
