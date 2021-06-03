import React from 'react';
import PropTypes from 'prop-types';

import Button from 'app/components/button';

export default class Input extends React.Component {
  state = {
    isFocused: false,
  };

  onChange = e => this.props.onChange?.(e.target.value);

  onFocus = () => this.setState({ isFocused: true });

  onBlur = () => this.setState({ isFocused: false });

  render() {
    const { mods, onButtonClick, ...rest } = this.props;
    const { isFocused } = this.state;
    const searchButtonLabel = 'Click to start search';

    return (
      <div className={b('input', this.props, { focused: isFocused })}>
        <input
          className="input__field"
          {...rest}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />

        {
          mods.type === 'search' && (
            <Button
              mods={{ icon: 'magnifier', type: 'primary' }}
              mix="input__button"
              onClick={onButtonClick}
              aria-label={searchButtonLabel}
              title={searchButtonLabel}
            />
          )
        }
      </div>
    );
  }
}

Input.defaultProps = {
  mods: {},
  type: 'text',
};

Input.propTypes = {
  onButtonClick: PropTypes.func,
  mods: PropTypes.shape({
    type: PropTypes.oneOf(['search']),
    disabled: PropTypes.bool,
  }),
};
