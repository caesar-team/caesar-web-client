import { Component } from 'react';
import { isClient } from 'common/utils/isEnvironment';

const DEFAULT_EVENTS = [
  'mousemove',
  'keydown',
  'wheel',
  'mouseWheel',
  'mousedown',
  'touchstart',
  'touchmove',
];

class SessionChecker extends Component {
  idle = false;

  componentDidMount() {
    if (!isClient) {
      return;
    }

    const { events = DEFAULT_EVENTS } = this.props;

    events.forEach(e => {
      document.addEventListener(e, this.handleEvent, {
        passive: true,
      });
    });
  }

  componentWillUnmount() {
    if (!isClient) {
      return;
    }

    const { events = DEFAULT_EVENTS } = this.props;

    clearTimeout(this.tId);

    events.forEach(e => {
      document.removeEventListener(e, this.handleEvent, {
        passive: true,
      });
    });
  }

  handleEvent = event => {
    // TODO: supposed to will added check on changing cursor position
    // TODO: and other cases
    this.resetTimeout();
  };

  resetTimeout() {
    const { timeout, onFinishTimeout } = this.props;

    clearTimeout(this.tId);

    this.tId = setTimeout(() => {
      onFinishTimeout();
    }, timeout);
  }

  render() {
    return this.props.children;
  }
}

export default SessionChecker;
