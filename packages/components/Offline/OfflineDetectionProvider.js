import React, { PureComponent, createContext } from 'react';
import { isClient } from '@caesar/common/utils/isEnvironment';

const { Consumer, Provider } = createContext({});

class OfflineDetectionProvider extends PureComponent {
  state = this.prepareInitialState();

  componentDidMount() {
    window.addEventListener('online', this.handleOnlineEvent);
    window.addEventListener('offline', this.handleOfflineEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineEvent);
    window.removeEventListener('offline', this.handleOfflineEvent);
  }

  handleOnlineEvent = () => this.setState({ isOnline: true });

  handleOfflineEvent = () => this.setState({ isOnline: false });

  prepareInitialState() {
    return {
      isOnline: isClient ? navigator.onLine : true,
    };
  }

  render() {
    const { children } = this.props;
    const { isOnline } = this.state;

    return <Provider value={{ isOnline }}>{children}</Provider>;
  }
}

export const ContextConsumer = Consumer;
export default OfflineDetectionProvider;
