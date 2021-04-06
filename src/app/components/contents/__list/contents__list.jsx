import React from 'react';
import PropTypes from 'prop-types';

const Contents__List = ({ item }) => {
  const { children } = item;
  let list = null;

  if (children.length) {
    list = (
      <ul className="contents__list">
        {
          children.map(i => (
            <Contents__List item={i} key={i.index} />
          ))
        }
      </ul>
    );
  }

  return (
    <li className="contents__item">
      <a href={`#${item.anchor}`}>
        {/* use dangerouslySetInnerHTML because could be markup in response */}
        <span dangerouslySetInnerHTML={{__html: item.name}}/>
      </a>

      {list}
    </li>
  );
};

Contents__List.propTypes = {
  item: PropTypes.shape({
    level: PropTypes.number,
    index: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
    children: PropTypes.array,
  }),
};

export default Contents__List;
