import React from 'react';

import Link from 'app/components/link';
import SVGIcon from 'app/components/svg-icon';

const Logo = props => (
  <Link mix={b('logo', props)} to="/wiki/Main_Page" aria-label="To the main page">
    <SVGIcon
      mods={{ type: 'logo' }}
      mix="logo__icon"
    />
  </Link>
);

export default Logo;
