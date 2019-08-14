import React from 'react';
import styled from 'styled-components';
import { Icon } from 'components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LinkText = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  margin-left: 20px;
`;

const BackLink = ({ children, onClick = Function.prototype, ...props }) => (
  <Wrapper {...props} onClick={onClick}>
    <Icon name="arrow-back" width={16} height={16} />
    <LinkText>{children}</LinkText>
  </Wrapper>
);

export default BackLink;
