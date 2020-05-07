import React from 'react';
import NotificationConsumer from './NotificationConsumer';

const withNotification = Component => props => (
  <NotificationConsumer>
    {context => <Component notification={context} {...props} />}
  </NotificationConsumer>
);

export default withNotification;
