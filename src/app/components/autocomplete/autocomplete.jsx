import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Input from 'app/components/input';
import Link from "app/components/link";

import { KEY } from 'app/constants/common';

import uniqueId from 'app/utils/unique-id';

// aria combobox https://www.w3.org/TR/wai-aria-practices-1.1/#combobox
// https://a11y-guidelines.orange.com/en/articles/autocomplete-component/#resources

class Autocomplete extends React.Component {
  state = {
    isOpen: false,
    selectedOptionIndex: 0,
  };

  listId = uniqueId('autocomplete');

  optionsRefs  = [];

  autocompleteRef = React.createRef();

  componentDidMount() {
    window.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = e => {
    if (this.autocompleteRef.current.contains(e.target)) return;

    this.setState({ isOpen: false });
  };

  handleKeyDown = (e) => {
    switch (e.keyCode) {
      case KEY.ESC:
        this.handleEsc(e);
        break;

      case KEY.ENTER:
      case KEY.SPACE:
        this.handleEnter(e);
        break;

      case KEY.DOWN:
        this.handleDown(e);
        break;

      case KEY.UP:
        this.handleUp(e);
        break;
    }
  };

  handleEsc(e) {
    const { isOpen } = this.state;

    if (!isOpen) return;

    this.setState({ isOpen: false });
    e.preventDefault();
  }

  handleEnter(e) {
    const { selectedOptionIndex } = this.state;

    if (selectedOptionIndex === -1) return;

    const { options, onChange } = this.props;
    const { title, link } = options[selectedOptionIndex];

    e.preventDefault();

    if (link) {
      onChange?.('');
      // todo: close search on mobile after redirect
      this.props.history.push(link);
    } else {
      onChange?.(title);
    }
    this.setState({ isOpen: false, selectedOptionIndex: 0 });
  }

  handleUp(e) {
    const { selectedOptionIndex } = this.state;
    const { options } = this.props;
    const isFirstElementSelected = selectedOptionIndex === 0;

    e.preventDefault();

    if (isFirstElementSelected) {
      this.setState({ selectedOptionIndex: options.length - 1 }, this.scrollToSelectedItem);

      return;
    }

    this.setState({ selectedOptionIndex: selectedOptionIndex - 1 }, this.scrollToSelectedItem);
  }

  handleDown(e) {
    const { selectedOptionIndex } = this.state;
    const { options } = this.props;
    const isLastElementSelected = selectedOptionIndex === (options.length - 1);

    e.preventDefault();

    if (isLastElementSelected) {
      this.setState({ selectedOptionIndex: 0 }, this.scrollToSelectedItem);
      return;
    }

    this.setState({ selectedOptionIndex: selectedOptionIndex + 1 }, this.scrollToSelectedItem);
  }

  handleChange = (value) => {
    const { options } = this.props;

    if (options.length) {
      this.setState({ isOpen: true, selectedOptionIndex: 0 }, this.scrollToSelectedItem);
    }

    this.props.onChange?.(value);
  };

  handleOptionClick = value => {
    this.setState({ isOpen: false });

    this.props.onChange?.(value);
  };

  scrollToSelectedItem = () => {
    const { selectedOptionIndex } = this.state;

    this.optionsRefs?.[selectedOptionIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  render() {
    const { value, placeholder, options } = this.props;
    const { isOpen, selectedOptionIndex } = this.state;

    return (
      <div
        className={b('autocomplete', this.props, { open: isOpen && !!options.length })}
        onKeyDown={this.handleKeyDown}
        ref={this.autocompleteRef}
      >
        <Input
          mods={{ icon: 'magnifier' }}
          type="search"
          value={value}
          onChange={this.handleChange}
          placeholder={placeholder}
          autoComplete="new-item"
          role="combobox"
          aria-expanded={isOpen}
          aria-owns={this.listId}
          aria-autocomplete="list"
          aria-activedescendant={this.optionsRefs?.[selectedOptionIndex]?.id}
          title="Start typing to search"
      />

        <ul
          className="autocomplete__list"
          role="listbox"
          id={this.listId}
        >
          {
            isOpen && options.map((item, index) => {
              const isLink = item.hasOwnProperty('link');
              const Tag = isLink ? Link : 'span';
              const isItemSelected = selectedOptionIndex === index;

              return (
                <li
                  className={b('autocomplete__option', {}, { selected: isItemSelected })}
                  key={`${this.listId}__option-${index}`}
                  onClick={() => this.handleOptionClick(item.title)}
                  role="option"
                  tabIndex="-1"
                  aria-selected={isItemSelected}
                  id={`${this.listId}__option-${index}`}
                  ref={r => this.optionsRefs[index] = r}
                >
                  <Tag
                    tabIndex="-1"
                    {...(isLink ? { to: item.link, mix: 'autocomplete__option-content' } : { className: 'autocomplete__option-content' })}
                  >
                    {item.title}
                  </Tag>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

Autocomplete.defaultProps = {
  placeholder: 'Search article',
};

Autocomplete.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
  })),
};

export default withRouter(Autocomplete);
