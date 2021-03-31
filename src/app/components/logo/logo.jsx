import React from 'react';

import Link from 'app/components/link';

const Logo = props => (
  <Link className={b('logo', props)} to="/">
    {/* todo: replace on SVG to have the opportunity to change colour on hover */}
    <img
      className="logo__image"
      src={require('./__image/logo__image.png')}
      srcSet={require('./__image/logo__image.png')}
      alt="Wikipedia, the free encyclopedia"
    />
  </Link>
);

export default Logo;
