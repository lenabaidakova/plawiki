import React from 'react';

import Link from 'app/components/link';

const Logo = props => (
  <Link mix={b('logo', props)} to="/wiki/Main_Page">
    {/* todo: replace on SVG to have the opportunity to change colour on hover */}
    <img
      className="logo__image"
      src={require('./__image/logo__image.svg')}
      alt="Wikipedia, the free encyclopedia"
    />
  </Link>
);

export default Logo;
