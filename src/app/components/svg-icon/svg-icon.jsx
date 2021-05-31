import React from 'react';
import PropTypes from 'prop-types';

const SVGIcon = props => {
  const { mods, width, height } = props;

  if (!mods.type) return '';

  const symbolId = require(`./__symbol/_type/_${mods.type}/svg-icon__symbol_type_${mods.type}.svg`);

  return (
    <svg
      className={b('svg-icon', props)}
      width={width}
      height={height}
      focusable="false"
    >
      <use xlinkHref={`#${symbolId.default.id}`}/>
    </svg>
  );
};

SVGIcon.defaultProps = {
  mods: {},
  width: null,
  height: null,
};

SVGIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  mods: PropTypes.shape({
    type: PropTypes.string,
  }),
};

export default SVGIcon;
