import React from 'react';
import PropTypes from 'prop-types';

import Contents__List from './__list';

const Contents = props => {
  return (
    <div className={b('contents', props)}>
      <ul className="contents__list">
        {
          props.list.map((item, index) => (
            <Contents__List item={item} key={index}/>
          ))
        }
      </ul>
    </div>
  );
};

Contents.defaultProps = {
  list: [],
};

Contents.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    level: PropTypes.number,
    index: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
    children: PropTypes.array,
  })),
};

export default Contents;
