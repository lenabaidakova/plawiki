import React from 'react';

import Button from 'app/components/button';

export default class Input extends React.Component {
  state = {
    isFocused: false,
  };

  onChange = (e) => this.props?.onChange(e.target.value);

  onFocus = () => this.setState({ isFocused: true });

  onBlur = () => this.setState({ isFocused: false });

  render() {
    const { value, placeholder, mods: { type }, onButtonClick } = this.props;
    const { isFocused } = this.state;

    return (
      <div className={b('input', this.props, { focused: isFocused })}>
        <input
          className="input__field"
          value={value}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          placeholder={placeholder}
        />

        {
          type === 'search' && (
            <Button mix="input__button" onClick={onButtonClick}/>
          )
        }
      </div>
    );
  }
}

Input.defaultProps = {
  mods: {},
};
