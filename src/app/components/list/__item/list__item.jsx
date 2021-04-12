import React from 'react';
import PropTypes from 'prop-types';

const List__Item = props => {
  const { children } = props;

  return (
    <li className={b('list__item', props)}>{children}</li>
  );
};

List__Item.propTypes = {
  children: PropTypes.node,
};

export default List__Item;
