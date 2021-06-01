import React from 'react';
import PropTypes from 'prop-types';

import Button from 'app/components/button';

import uniqueId from 'app/utils/unique-id';

// aria documentation: https://www.w3.org/TR/wai-aria-practices-1.1/#accordion

export default class Accordion extends React.Component {
  state = {
    isExpanded: this.props.isExpanded,
  };

  defaultId = uniqueId('accordion');

  ariaControlsId = uniqueId('accordion-aria');

  onToggle = () => this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));

  render() {
    const { summary, children } = this.props;
    const { isExpanded } = this.state;

    return (
      <div className={b('accordion', this.props, { expanded: isExpanded })}>
        <h3 className="accordion__headline">
          <Button
            mix="accordion__summary"
            aria-expanded={isExpanded}
            aria-controls={this.ariaControlsId}
            id={this.defaultId}
            onClick={this.onToggle}
          >
            {summary}
          </Button>
        </h3>

        <div
          className="accordion__details"
          id={this.ariaControlsId}
          role="region"
          aria-labelledby={this.defaultId}
        >
          {children}
        </div>
      </div>
    );
  }
}

Accordion.defaultProps = {
  isExpanded: true,
};

Accordion.propTypes = {
  children: PropTypes.node,
  summary: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool,
};
