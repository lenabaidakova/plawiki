import React from 'react';
import PropTypes from 'prop-types';

import Hamburger from 'app/components/hamburger';

export default class Aside extends React.Component {
  state = {
    scrollTop: 0,
    isMenuOpen: false,
  };

  componentDidMount() {
    document.addEventListener('scroll', this.onPageScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onPageScroll);
  }

  onMenuToggle = () => this.setState(prevState => ({ isMenuOpen: !prevState.isMenuOpen }));

  onPageScroll = () => {
    const document = window.document.documentElement;
    const { scrollTop: prevScrollTop } = this.state;

    this.body.scrollTop = this.body.scrollTop + (document.scrollTop - prevScrollTop);
    this.setState({ scrollTop: document.scrollTop });
  };

  render() {
    const { children} = this.props;
    const { isMenuOpen } = this.state;

    return (
      <aside
        className={b('aside', this.props)}
        ref={r => (this.body = r)}
      >
        <Hamburger
          mods={{ open: isMenuOpen }}
          mix="aside__button"
          onClick={this.onMenuToggle}
        />

        <div className="aside__body">{children}</div>
      </aside>
    );
  }
}

Aside.propTypes = {
  children: PropTypes.node,
};
