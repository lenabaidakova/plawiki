import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from 'app/components/svg-icon';
import Link from 'app/components/link';

const Button = props => {
  const { children, mods, mix, type, ...rest } = props;
  const isLink = !!props.to || !!props.href;
  const Tag = isLink ? Link : 'button';

  return (
    <Tag
      className={b('button', { mods, mix })}
      {...((isLink && mods.disabled) ? { tabIndex: '-1'} : {})}
      {...((!isLink && mods.disabled) ? { disabled: true } : {})}
      {...(!isLink ? { type } : {})}
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
    </Tag>
  );
};

Button.defaultProps = {
  mods: {},
  type: 'button',
};

Button.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
  href: PropTypes.string,
  mods: PropTypes.shape({
    type: PropTypes.oneOf(['primary']),
    disabled: PropTypes.bool,
  }),
};

export default Button;
