import React from 'react';

import Autocomplete from 'app/components/autocomplete';

export default class Search extends React.Component {
  state = {
    value: '',
    searchList: [],
  };

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
    const { value, searchList } = this.state;

    return (
      <form
        className={b('search', this.props)}
        onSubmit={this.onSubmit}
      >
        <Autocomplete
          onChange={this.onChange}
          onSearch={this.onSearch}
          value={value}
          list={searchList}
        />
      </form>
    );
  }
}