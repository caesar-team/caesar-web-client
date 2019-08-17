import React, { PureComponent } from 'react';
import { ContextConsumer } from './OfflineDetectionProvider';

class OfflineDetectionConsumer extends PureComponent {
  render() {
    return (
      <ContextConsumer>
        {context => this.props.children(context)}
      </ContextConsumer>
    );
  }
}

export default OfflineDetectionConsumer;
