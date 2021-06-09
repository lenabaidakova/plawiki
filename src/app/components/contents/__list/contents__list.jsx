import React from 'react';
import PropTypes from 'prop-types';

import Link from 'app/components/link';
import List, { List__Item } from 'app/components/list';

const Contents__List = props => {
  const { item, onClick } = props;
  let list = null;

  if (item.children.length) {
    list = (
      <List mods={{ type: 'primary'}}>
        {
          item.children.map(i => (
            <Contents__List item={i} key={`${i.index}_${i.name}`} onClick={onClick}/>
          ))
        }
      </List>
    );
  }

  return (
    <List__Item>
      <Link
        mods={{ type: 'primary' }}
        activeClassName="link_active"
        to={`#${item.anchor}`}
        isActive={(match, location) => location.hash === `#${item.anchor}`}
        onClick={onClick}
      >
        {/* use dangerouslySetInnerHTML because could be markup in response */}
        <span dangerouslySetInnerHTML={{__html: item.name}}/>
      </Link>

      {list}
    </List__Item>
  );
};

Contents__List.propTypes = {
  onClick: PropTypes.func,
  item: PropTypes.shape({
    level: PropTypes.number,
    index: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
    children: PropTypes.array,
  }),
};

export default Contents__List;
