import React from 'react';
import PropTypes from 'prop-types';

const Button = props => {
  const { children, onClick, id, ariaExpanded, ariaControls } = props;

  return (
    <button
      className={b('button', props)}
      onClick={onClick}
      id={id}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >{children}</button>
  );
};

Button.defaultProps = {
};

Button.propTypes = {
  ariaExpanded: PropTypes.bool,
  ariaControls: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string,
};

export default Button;
