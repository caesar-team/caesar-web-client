import React from 'react';
import OfflineDetectionConsumer from './OfflineDetectionConsumer';

const withOfflineDetection = Component => props => (
  <OfflineDetectionConsumer>
    {context => <Component notification={context} {...props} />}
  </OfflineDetectionConsumer>
);

export default withOfflineDetection;
