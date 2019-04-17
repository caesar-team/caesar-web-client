import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const Scrollbar = ({ children, className, style, ...restProps }) => (
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
    {...restProps}
  >
    {children}
  </Scrollbars>
);

export default Scrollbar;
