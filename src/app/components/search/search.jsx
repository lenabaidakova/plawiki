import React from 'react';

import Autocomplete from 'app/components/autocomplete';

import queryBuilder from 'app/utils/query-builder';
import fetchWrapper from 'app/utils/fetch-wrapper';

const SEARCH_ROUTE = '/search/';

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
      formatversion: '2',
    };

    try {
      const data = await fetchWrapper(`https://en.wikipedia.org/w/api.php?${queryBuilder(params)}`);
      const options = data.query.prefixsearch.map(({ title }) => ({ title, link: `/wiki/${title}` }));

      options.push({
        title: 'Show all results',
        link: `${SEARCH_ROUTE}${value}`,
      });

      this.setState({ options });
    } catch (e) {
      console.error(e); // todo: show error in ui
    }
  };

  render() {
    const { value, options } = this.state;

    return (
      <form
        className={b('search', this.props)}
      >
        <Autocomplete
          onChange={this.onChange}
          value={value}
          options={options}
        />
      </form>
    );
  }
}
