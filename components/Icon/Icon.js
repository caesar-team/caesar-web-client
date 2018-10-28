import React from 'react';
import { Icon as AntdIcon } from 'antd';

const Icon = ({ size, ...props }) => (
  <AntdIcon {...props} style={{ fontSize: size }} />
);

export default Icon;

