import React from 'react';
import PropTypes from 'prop-types';

const Mark = props => {
  const { children } = props;

  return (
    <span className={b('mark', props)}>{children}</span>
  );
};

Mark.propTypes = {
  children: PropTypes.node,
};

export default Mark;
