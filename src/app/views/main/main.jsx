import React from 'react';

import Button from 'app/components/button';
import Link from 'app/components/link';

export default class Main extends React.PureComponent {
  state = {
    value: '',
    searchList: [],
  };

  onChange = (event) => {
    this.setState({ value: event.target.value})
  };

  onClick = () => {
    const { value } = this.state;

    if (!value) {
      this.setState({ searchList: []});

      return;
    }

    // https://www.mediawiki.org/w/api.php?action=opensearch&origin=*&search=Nelson
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=prefixsearch&pssearch=${value}`)
      .then(response => response.json())
      .then(data => this.setState({ searchList: data.query.prefixsearch}))
      .then(json => console.log(json))
  };

  getPage = (pageid) => {
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=parse&format=json&pageid=${pageid}`)
      .then(response => response.json())
      .then(data => this.content.innerHTML = data.parse.text['*'])
      .then(json => console.log(json))
  };

  render() {
    const { searchList, value } = this.state;

    return (
      <div>
        <input onChange={this.onChange} value={value}/>
        <Button mods={{ type: 'primary' }} onClick={this.onClick}>Поиск</Button>

        <ul>
          {
            !!searchList.length && searchList.map((item, index) => (
              <li key={index}><button onClick={() => this.getPage(item.pageid)}>{item.title}</button></li>
            ))
          }
        </ul>

        <div ref={r => (this.content = r)}>

        </div>

        <Link mods={{ type: 'primary' }} to='/secondary'>To secondary page</Link>

        <div>Hi!</div>
      </div>
    );
  }
}

Main.propTypes = {};
