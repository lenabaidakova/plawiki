import React from 'react';
import PropTypes from 'prop-types';

import Accordion from 'app/components/accordion';
import List from 'app/components/list';

import Contents__List from './__list';

const Contents = props => {
  const { list, headline } = props;

  return (
    <section className={b('contents', props)}>
      <Accordion summary={headline}>
        <List mods={{ type: 'primary'}}>
          {
            list.map((item, index) => (
              <Contents__List item={item} key={index}/>
            ))
          }
        </List>
      </Accordion>
    </section>
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
  headline: PropTypes.string,
};

export default Contents;
