import React from 'react';
import PropTypes from 'prop-types';

import Link from 'app/components/link';
import Mark from 'app/components/mark';
import Meta from 'app/components/meta';

const Card = props => {
  const { href, to, headline, children, meta } = props;

  return (
    <section className={b('card', props)}>
      {/* todo: add hidden h1 to page */}
      <h2 className="card__headline">
        <Link mods={{ type: 'secondary '}} mix="card__link" to={to} href={href}>{headline}</Link>
      </h2>

      <div className="card__description">
        {children}
      </div>

      {
        !!meta.length && (
          <Mark mods={{ type: 'primary' }} mix="card__meta">
            <Meta items={meta}/>
          </Mark>
        )
      }
    </section>
  );
};

Card.defaultProps = {
  meta: [],
};

Card.propTypes = {
  href: PropTypes.string,
  to: PropTypes.string,
  headline: PropTypes.string,
  children: PropTypes.node,
  meta: PropTypes.array,
};

export default Card;
