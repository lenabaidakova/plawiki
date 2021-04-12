import React from 'react';
import PropTypes from 'prop-types';

export default class Aside extends React.Component {
  state = {
    scrollTop: 0,
  };

  componentDidMount() {
    document.addEventListener('scroll', this.onPageScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onPageScroll);
  }

  onPageScroll = () => {
    const document = window.document.documentElement;
    const { scrollTop: prevScrollTop } = this.state;

    this.body.scrollTop = this.body.scrollTop + (document.scrollTop - prevScrollTop);
    this.setState({ scrollTop: document.scrollTop });
  };

  render() {
    const { children} = this.props;

    return (
      <aside
        className={b('aside', this.props)}
        ref={r => (this.body = r)}
      >
        {children}
      </aside>
    );
  }
}

Aside.propTypes = {
  children: PropTypes.node,
};
