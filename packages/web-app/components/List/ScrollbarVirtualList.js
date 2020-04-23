import React, { forwardRef } from 'react';
import { Scrollbar } from '../Scrollbar';

const ScrollbarVirtualList = forwardRef((props, ref) => (
  <Scrollbar {...props} customRef={ref} />
));

export default ScrollbarVirtualList;
