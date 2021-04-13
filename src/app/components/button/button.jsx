import React from 'react';
import PropTypes from 'prop-types';

const Button = props => {
  const { children, mods, mix, ...rest } = props;

  return (
    <button
      className={b('button', { mods, mix })}
      {...rest}
    >{children}</button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
};

export default Button;
