import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 3px;
  letter-spacing: inherit;
  background: none;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  outline: none;

  &:hover {
    color: ${({ theme }) => theme.gray};
  }
`;

const Text = styled.span`
  padding-left: 12px;
  font-size: 14px;
`;

const BackButton = ({ children, ...props }) => (
  <StyledButton type="button" {...props}>
    <Icon name="arrow-back" isInButton width={14} height={14} />
    <Text>{children}</Text>
  </StyledButton>
);

export default BackButton;
