import React from 'react';
import PropTypes from 'prop-types';

import Button from 'app/components/button';

const Hamburger = props => {
  const { id, mods: { open }, onClick } = props;
  const menuTitle = open ? 'Close menu' : 'Open menu';

  return (
    <Button
      mix={b('hamburger', props)}
      aria-expanded={open}
      aria-has-popup="true"
      aria-label={menuTitle}
      title={menuTitle}
      id={id}
      onClick={onClick}
    >
      <div className="hamburger__bar"/>
    </Button>
  );
};

Hamburger.defaultProps = {
  mods: {},
};

Hamburger.propTypes = {
  id: PropTypes.string,
  mods: PropTypes.shape({
    open: PropTypes.bool,
  }),
  onClick: PropTypes.func,
};

export default Hamburger;
