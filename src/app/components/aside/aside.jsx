import React from 'react';
import Button from 'app/components/button';

export default class Aside extends React.Component {
  state = {
    isSidebarHidden: false,
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

        <div className="aside__body">{children}</div>
      </aside>
    );
  }
}

Aside.defaultProps = {};

Aside.propTypes = {};
