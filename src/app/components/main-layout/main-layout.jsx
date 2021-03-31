import React from 'react';
import PropTypes from 'prop-types';

const MainLayout = props => {
  const { children } =  props;

  return (
    <div>
      <header>Header</header>

      <main>{children}</main>

      <footer>Footer</footer>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
