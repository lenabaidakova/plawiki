import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import MainLayout from 'app/components/main-layout';

export default class RouteMain extends React.PureComponent {
  renderComponentWithLayout = props => {
    const { component: Component } = this.props;

    return (
      <MainLayout {...props}>
        <Component {...props}/>
      </MainLayout>
    );
  };

  render() {
    const { component: Component, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={this.renderComponentWithLayout}
      />
    );
  }
}

RouteMain.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};
