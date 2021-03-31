import React from 'react';
import PropTypes from 'prop-types';

import { Link, NavLink } from 'react-router-dom';

export default class SmartLink extends React.PureComponent {
  onClick = event => {
    if (this.props.to === 'nowhere') {
      event.preventDefault();

      return;
    }

    if (this.props.onClick) this.props.onClick(event);
  };

  render() {
    const Component = this.props.activeClassName ? NavLink : Link;
    const Tag = this.props.to ? Component : 'a';

    return (
      <Tag {...this.props} onClick={this.onClick}/>
    );
  }
}

SmartLink.propTypes = {
  to: PropTypes.node,
  activeClassName: PropTypes.string,
  onClick: PropTypes.func,
};
