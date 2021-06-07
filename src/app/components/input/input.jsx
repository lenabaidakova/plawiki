import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from 'app/components/svg-icon';

export default class Input extends React.Component {
  state = {
    isFocused: false,
  };

  handleChange = e => this.props.onChange?.(e.target.value);

  handleFocus = () => this.setState({ isFocused: true });

  handleBlur = () => this.setState({ isFocused: false });

  render() {
    const { mods, onButtonClick, ...rest } = this.props;
    const { isFocused } = this.state;

    return (
      <div className={b('input', this.props, { focused: isFocused })}>
        {
          mods.icon && (
            <SVGIcon
              mods={{ type: 'magnifier' }}
              mix="input__icon"
            />
          )
        }

        <input
          className="input__field"
          {...rest}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          disabled={mods.disabled}
        />
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
  }),
};
