import React from 'react';
import PropTypes from 'prop-types';

const Meta = props => {
  const { items } = props;

  return (
    <ul className={b('meta', props)}>
      {
        items.map((item, i) => (
          <li className="meta__item" key={i}>{item}</li>
        ))
      }
    </ul>
  );
};

Meta.defaultProps = {
  items: [],
};

Meta.propTypes = {
  items: PropTypes.array,
};

export default Meta;
