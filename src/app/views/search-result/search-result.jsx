import React from 'react';

import MainLayout from 'app/components/main-layout';
import Card from 'app/components/card';

import queryBuilder from 'app/utils/query-builder';
import fetchWrapper from 'app/utils/fetch-wrapper';

import { apiUserAgent } from 'app/constants/common';

export default class SearchResult extends React.Component {
  state = {
    isLoading: false,
    list: [],
    error: {},
  };

  componentDidMount() {
    this.getSearchResult(this.props.match.params.title);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.title !== prevProps.match.params.title) {
      this.getSearchResult(this.props.match.params.title);
    }
  }

  getSearchResult = async title => {
    // todo: add ability to show more than 10 results
    this.setState({ isLoading: true });

    const params = {
      origin: '*',
      action: 'query',
      format: 'json',
      formatversion: '2',
      list: 'search',
      srsearch: title,
    };

    const error = {};

    try {
      // api https://www.mediawiki.org/w/api.php?action=help&modules=query%2Bsearch
      const data = await fetchWrapper(`https://en.wikipedia.org/w/api.php?${queryBuilder(params)}`, apiUserAgent);
      const list = [];

      data.query.search.forEach(item => list.push(item));

      if (!list.length) {
        error.info = "Such a page doesn't exist";
      }

      this.setState({ isLoading: false, error, list });

    } catch (e) {

      console.error(e);

      const error = {
        status: e.status,
        info: e.error?.info || e.info || 'Something was wrong. Try later'
      };

      this.setState({ isLoading: false, error });
    }
  };

  render() {
    const { isLoading, list, error } = this.state;

    return (
      <MainLayout
        mods={{ loading: isLoading }}
        error={error}
      >
        {
          list.map(({ pageid, title, snippet, size, timestamp, wordcount }) => {
            const date = new Date(timestamp).toLocaleString();
            const sizeInKb = Math.round(size / 1000);
            const metaItems = [
              `${wordcount} words`,
              `${sizeInKb} KB`,
              date,
            ];

            return (
              <Card
                key={pageid}
                to={`/wiki/${title}`}
                headline={title}
                meta={metaItems}
              >
                {/* use dangerouslySetInnerHTML because could be markup in response */}
                <span dangerouslySetInnerHTML={{__html: snippet}}/>...
              </Card>
            )
          })
        }
      </MainLayout>
    );
  }
}
