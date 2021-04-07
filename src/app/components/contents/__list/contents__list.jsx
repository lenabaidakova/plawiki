import React from 'react';
import PropTypes from 'prop-types';

import Link from 'app/components/link';

const Contents__List = props => {
  const { item } = props;
  let list = null;

  if (item.children.length) {
    list = (
      <ul className="contents__list">
        {
          item.children.map(i => (
            <Contents__List item={i} key={i.index} />
          ))
        }
      </ul>
    );
  }

  return (
    <li className="contents__item">
      <Link
        mods={{ type: 'primary' }}
        activeClassName="link_active"
        to={`#${item.anchor}`}
        isActive={(match, location) => location.hash === `#${item.anchor}`}
      >
        {/* use dangerouslySetInnerHTML because could be markup in response */}
        <span dangerouslySetInnerHTML={{__html: item.name}}/>
      </Link>

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
