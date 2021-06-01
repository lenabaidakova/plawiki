import React from 'react';
import PropTypes from 'prop-types';

import { Link, NavLink  } from 'react-router-dom';

export default class SmartLink extends React.Component {
  onClick = event => {
    if (this.props.to === 'nowhere') {
      event.preventDefault();

      return;
    }

    this.props.onClick?.(event);
  };

  render() {
    const { activeClassName, to, children } = this.props;
    const Component = activeClassName ? NavLink : Link;
    const Tag = to ? Component : 'a';
    const { mods, mix, ...rest } = this.props;

    return (
      <Tag
        className={b('link', { mods, mix })}
        {...this.props.target === '_blank' ? { rel: 'noopener noreferrer' } : {}}
        {...rest}
        onClick={this.onClick}
      >{children}</Tag>
    );
  }
}

SmartLink.propTypes = {
  to: PropTypes.node,
  activeClassName: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
};
