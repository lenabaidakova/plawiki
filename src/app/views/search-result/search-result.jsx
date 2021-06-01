import React from 'react';

import MainLayout from 'app/components/main-layout';
import Link from 'app/components/link';

export default class SearchResult extends React.Component {
  state = {
    isLoading: false,
    list: [],
  };

  componentDidMount() {
    this.getSearchResult(this.props.match.params.title);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.title !== prevProps.match.params.title) {
      this.getSearchResult(this.props.match.params.title);
    }
  }

  getSearchResult = (pageid) => {
    this.setState({ isLoading: true });

    // api https://www.mediawiki.org/w/api.php?action=help&modules=query%2Bsearch
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&srsearch=${pageid}`)
      .then(response => response.json())
      .then(data => {
        const list = [];

        data.query.search.forEach(({ pageid, snippet, title}) => {
          list.push({ pageid, snippet, title});
        });

        this.setState({ list, isLoading: false });
      })
  };

  renderContent = (sections) => {

  };

  render() {
    const { isLoading, list } = this.state;

    console.dir(list);

    return (
      <MainLayout
        mods={{ loading: isLoading }}
      >
        {
          list.map(item => (
            <div key={item.pageid}>
              <Link to={`/wiki/${item.title}`}>{item.title}</Link>

              <div dangerouslySetInnerHTML={{__html: item.snippet}}/>
            </div>
          ))
        }
      </MainLayout>
    );
  }
}
