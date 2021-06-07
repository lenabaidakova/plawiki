import React from 'react';
import PropTypes from 'prop-types';

import Logo from 'app/components/logo';
import Hamburger from 'app/components/hamburger';
import Button from 'app/components/button';

import { HEADER_ID } from 'app/constants/common';

const Page__Header = props => {
  const { isMobileMenuOpen, onToggleMobileMenu, onToggleSearch } = props;
  return (
    <header className="page__header" id={HEADER_ID}>
      <Hamburger
        mods={{ open: isMobileMenuOpen }}
        mix="page__hamburger"
        onClick={onToggleMobileMenu}
      />

      <Logo mix="page__logo"/>

      <Button mods={{ icon: 'magnifier', type: 'primary' }} onClick={onToggleSearch} />
    </header>
  );
};

Page__Header.propTypes = {
  isMobileMenuOpen: PropTypes.bool,
  onToggleMobileMenu: PropTypes.func,
  onToggleSearch: PropTypes.func,
};

export default Page__Header;
