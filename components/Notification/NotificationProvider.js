import React, { PureComponent, createContext, createRef } from 'react';
import { uuid4 } from 'common/utils/uuid4';
import NotificationContainer from './NotificationContainer';
import Notification from './Notification';

const { Consumer, Provider } = createContext({});

class NotificationProvider extends PureComponent {
  static queue = [];

  ref = createRef();

  state = {
    notifications: [],
  };

  addNotificationFromQueue = () => {
    const { notifications } = this.state;

    if (!NotificationProvider.queue.length) return;

    const notification = NotificationProvider.queue.shift();

    this.setState({ notifications: [...notifications, notification] });
  };

  show = notification => {
    const { notifications } = this.state;

    NotificationProvider.queue.push({ props: notification, id: uuid4() });

    if (!notifications.length) this.addNotificationFromQueue();
  };

  hide = () => {
    const instance = this.ref.current;

    if (!instance) return;

    instance.hide();
  };

  handleHide = () => {
    this.addNotificationFromQueue();
  };

  handleNotificationRemove = () => {
    const { notifications } = this.state;

    this.setState({ notifications: notifications.slice(1) });
  };

  render() {
    const {
      children,
      component = Notification,
      timeout = 2500,
      position = 'top-center',
    } = this.props;
    const { notifications } = this.state;

    return (
      <Provider value={{ show: this.show, hide: this.hide }}>
        {children}

        {notifications.map((notification, index) => (
          <NotificationContainer
            notificationProps={notification.props}
            ref={index === notifications.length - 1 ? this.ref : undefined}
            key={notification.id}
            onHide={this.handleHide}
            onRemove={this.handleNotificationRemove}
            component={component}
            timeout={timeout}
            position={position}
          />
        ))}
      </Provider>
    );
  }
}

export const ContextConsumer = Consumer;
export default NotificationProvider;
