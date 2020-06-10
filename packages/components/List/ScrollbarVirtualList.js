import React, { forwardRef } from 'react';
import { Scrollbar } from '../Scrollbar';

export const ScrollbarVirtualList = forwardRef((props, ref) => (
  <Scrollbar {...props} customRef={ref} />
));
