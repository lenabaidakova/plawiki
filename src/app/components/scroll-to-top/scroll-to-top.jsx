import React from 'react';
import { withRouter } from 'react-router-dom';

// scroll to the top of the page on route change
// https://reactrouter.com/web/guides/scroll-restoration
class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    const { location: currentLocation } = this.props;
    const { location: prevLocation } = prevProps;

    if (currentLocation.pathname !== prevLocation.pathname && !currentLocation.hash) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
