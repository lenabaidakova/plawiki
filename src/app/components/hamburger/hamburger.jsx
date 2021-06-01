import React from 'react';
import PropTypes from 'prop-types';

import Button from 'app/components/button';

const Hamburger = props => {
  const { mods: { open }, onClick } = props;

  return (
    <Button
      mix={b('hamburger', props)}
      aria-expanded={open}
      aria-haspopup="true"
      aria-controls="menu"
      title={open ? 'Close menu' : 'Open menu'}
      onClick={onClick}
    >
      <span className="hamburger__bar"/>
    </Button>
  );
};

Hamburger.defaultProps = {
  mods: {},
};

Hamburger.propTypes = {
  mods: PropTypes.shape({
    open: PropTypes.bool,
  }),
  onClick: PropTypes.func,
};

export default Hamburger;
