import React from 'react';
import Button from 'app/components/button';

export default class Aside extends React.Component {
  state = {
    isSidebarHidden: false,
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

  onToggleSidebar = () => {
    this.setState(prevState => ({ isSidebarHidden: !prevState.isSidebarHidden }));
  };

  render() {
    const { children} = this.props;
    const { isSidebarHidden } = this.state;

    return (
      <aside className={b('aside', this.props, { hidden: isSidebarHidden })}>
        <Button
          mix="aside__controller"
          onClick={this.onToggleSidebar}
        >Show sidebar</Button>

        <div
          className="aside__body"
          ref={r => (this.body = r)}
        >{children}</div>
      </aside>
    );
  }
}

Aside.defaultProps = {};

Aside.propTypes = {};
