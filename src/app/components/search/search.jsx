import React from 'react';

import Autocomplete from 'app/components/autocomplete';

import queryBuilder from 'app/utils/query-builder';
import fetchWrapper from 'app/utils/fetch-wrapper';

export default class Search extends React.Component {
  state = {
    value: '',
    options: [],
  };

  onChange = value => this.setState({ value }, this.onSearch);

  onSearch = async () => {
    const { value } = this.state;

    if (!value) {
      this.setState({ options: []});

      return;
    }

    const params = {
      origin: '*',
      action: 'query',
      format: 'json',
      list: 'prefixsearch',
      pssearch: value,
    };

    try {
      const data = await fetchWrapper(`https://en.wikipedia.org/w/api.php?${queryBuilder(params)}`);
      const options = data.query.prefixsearch.map(({ title }) => ({ title, link: `/wiki/${title}` }));

      this.setState({ options });
    } catch (e) {
      console.error(e); // todo: show error in ui
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.onSearch();
  };

  render() {
    const { value, options } = this.state;

    return (
      <form
        className={b('search', this.props)}
        onSubmit={this.onSubmit}
      >
        <Autocomplete
          onChange={this.onChange}
          onSearch={this.onSearch}
          value={value}
          options={options}
        />
      </form>
    );
  }
}
