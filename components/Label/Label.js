import React from 'react';
import styled from 'styled-components';

const Text = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
  margin-bottom: 10px;
  margin-left: 15px;
`;

const Label = ({ children, ...props }) => <Text {...props}>{children}</Text>;

export default Label;
