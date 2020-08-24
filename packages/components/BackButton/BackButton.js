import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 3px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  outline: none;

  &:hover {
    color: ${({ theme }) => theme.color.gray};
  }
`;

const Text = styled.span`
  padding-left: 12px;
  font-size: 14px;
`;

const BackIcon = styled(Icon)`
  transform: scaleX(-1);
`;

const BackButton = ({ children, ...props }) => (
  <StyledButton type="button" {...props}>
    <BackIcon name="arrow" width={14} height={14} />
    <Text>{children}</Text>
  </StyledButton>
);

export default BackButton;
