import React from 'react';
import styled from 'styled-components';

const Text = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
`;

const Label = ({ children, ...props }) => <Text {...props}>{children}</Text>;

export default Label;
