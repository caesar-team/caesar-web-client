import React, { PureComponent } from 'react';
import { ContextConsumer } from './NotificationProvider';

class NotificationConsumer extends PureComponent {
  render() {
    return (
      <ContextConsumer>
        {context => this.props.children(context)}
      </ContextConsumer>
    );
  }
}

export default NotificationConsumer;
