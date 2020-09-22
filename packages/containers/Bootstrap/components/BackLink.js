import React from 'react';
import styled from 'styled-components';
import { Icon } from '@caesar/components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  & > * {
    ${({ disabled }) => disabled && `opacity: 0.2`}
  }
`;

const LinkText = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-left: 20px;
`;

const BackIcon = styled(Icon)`
  transform: scaleX(-1);
`;

const BackLink = ({
  children,
  disabled,
  onClick = Function.prototype,
  ...props
}) => (
  <Wrapper
    {...props}
    disabled={disabled}
    onClick={disabled ? Function.prototype : onClick}
  >
    <BackIcon name="arrow" width={16} height={16} />
    <LinkText>{children}</LinkText>
  </Wrapper>
);

export { BackLink };
