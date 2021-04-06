import React from 'react';
import PropTypes from 'prop-types';

const Page = props => (
  <div className={b('page', props)}>{props.children}</div>
);

Page.propTypes = {
  children: PropTypes.node,
};

export default Page;
