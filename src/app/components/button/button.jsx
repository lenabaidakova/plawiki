import React from 'react';
import PropTypes from 'prop-types';

const Button = props => {
  const { children, onClick } = props;

  return (
    <button className={b('button', props)} onClick={onClick}>{children}</button>
  );
};

Button.defaultProps = {
};

Button.propTypes = {
  children: PropTypes.node,
};

export default Button;
