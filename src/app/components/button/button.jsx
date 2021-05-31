import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from 'app/components/svg-icon';

const Button = props => {
  const { children, mods, mix, ...rest } = props;

  return (
    <button
      className={b('button', { mods, mix })}
      {...rest}
    >
      {children}

      {
        mods.icon && (
          <SVGIcon
            mods={{ type: mods.icon }}
            mix="button__icon"
          />
        )
      }
    </button>
  );
};

Button.defaultProps = {
  mods: {},
};

Button.propTypes = {
  children: PropTypes.node,
};

export default Button;
