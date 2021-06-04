import React from 'react';
import PropTypes from 'prop-types';

const List = props => {
  const { children } = props;

  return (
    <ul className={b('list', props)}>{children}</ul>
  );
};

List.propTypes = {
  children: PropTypes.node,
  mods: PropTypes.shape({
    type: PropTypes.oneOf(['primary']),
  }),
};

export default List;
