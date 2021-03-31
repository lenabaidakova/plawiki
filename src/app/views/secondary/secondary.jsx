import React from 'react';

import Link from 'app/components/link';

const Secondary = () => {
  return (
    <div>
      <Link mods={{ type: 'primary' }} to='/'>To main</Link>

      <div>Hi!</div>
    </div>
  );
};

export default Secondary;
