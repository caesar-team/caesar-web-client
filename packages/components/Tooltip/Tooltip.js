import React from 'react';
import ToolTip from 'react-power-tooltip';
import { isClient } from '@caesar/common/utils/isEnvironment';

export const Tooltip = props =>
  // To fix "ReferenceError: document is not defined at Tooltip.componentWillMount"
  isClient && (
    <ToolTip
      fontWeight="normal"
      borderRadius="3px"
      hoverBackground="none"
      hoverColor="none"
      {...props}
    />
  );
