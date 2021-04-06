import React from 'react';
import PropTypes from 'prop-types';

const WikiArticle = React.forwardRef((props, ref) => (
  <article
    className={b('wiki-article', props)}
    ref={ref}
  >{props.children}</article>
));

WikiArticle.propTypes = {
  children: PropTypes.node,
};

export default WikiArticle;
