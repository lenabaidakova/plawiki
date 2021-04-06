import React from 'react';
import PropTypes from 'prop-types';

import Page from 'app/components/page';
import Logo from 'app/components/logo';
import Autocomplete from 'app/components/autocomplete';

export default class MainLayout extends React.PureComponent {
  state = {
    value: '',
    searchList: [],
  };

  componentDidMount() {
    /*
      mw module for loading modules from Wikipedia
      https://www.mediawiki.org/wiki/ResourceLoader/Core_modules
      https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
    */
    const script = document.createElement('script');

    script.src = `/mw.js`;
    document.body.appendChild(script);
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
    const { children, toc } = this.props;
    const { searchList, value } = this.state;

    return (
      <Page>
        <aside className="page__aside">
          <div className="page__logo-wrapper">
            <Logo mix="page__logo"/>
          </div>

          {toc}
        </aside>

        <div className="page__body">
          <header className="page__header">
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
            {children}
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
