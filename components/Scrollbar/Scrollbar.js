import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const Scrollbar = ({ children, className, style }) => (
  <Scrollbars
    style={style}
    className={className}
    renderTrackHorizontal={props => (
      <div {...props} style={{ display: 'none' }} />
    )}
    renderThumbHorizontal={props => (
      <div {...props} style={{ display: 'none' }} />
    )}
    renderTrackVertical={props => (
      <div {...props} style={{ display: 'none' }} />
    )}
    renderThumbVertical={props => (
      <div {...props} style={{ display: 'none' }} />
    )}
  >
    {children}
  </Scrollbars>
);

export default Scrollbar;
