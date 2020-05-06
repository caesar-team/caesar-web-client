import React from 'react';
import ToolTip from 'react-power-tooltip';

const Tooltip = props => (
  <ToolTip
    fontWeight="normal"
    borderRadius="3px"
    hoverBackground="none"
    hoverColor="none"
    {...props}
  />
);

export default Tooltip;
