import React from 'react';

import Input from 'app/components/input';
import Link from "app/components/link";

import { KEY } from 'app/constants/common';

export default class Autocomplete extends React.Component {
  state = {
    isOpen: true,
  };

  onKeyDown = (e) => {
    const { isOpen } = this.state;

    if (e.keyCode === KEY.ESC && isOpen) {
      this.setState({ isOpen: false });
    }
  };

  render() {
    const { value, onChange, placeholder, list, onSearch } = this.props;
    const { isOpen } = this.state;

    return (
      <div
        className={b('autocomplete', this.props, { open: isOpen && !!list.length })}
        onKeyDown={this.onKeyDown}
      >
        <Input
          mods={{ type: 'search' }}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onButtonClick={onSearch}
        />

        {
          isOpen && (
            <ul className="autocomplete__list" role="listbox">
              {
                list.map((item, index) => (
                  <li className="autocomplete__item" key={index} role="option">
                    <Link
                      mix="autocomplete__button"
                      to={`/wiki/${item.title}`}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>
    );
  }
}

Autocomplete.defaultProps = {
  placeholder: 'Search',
};
