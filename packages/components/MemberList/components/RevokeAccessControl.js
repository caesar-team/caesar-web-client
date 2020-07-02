import React from 'react';
import styled from 'styled-components';

const RevokeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.color.black};
  border: none;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
`;

const MinusIcon = styled.div`
  width: 14px;
  height: 2px;
  background-color: ${({ theme }) => theme.color.white};
  cursor: pointer;
`;

const RevokeAccessControl = ({ onClickRevoke, className }) => (
  <RevokeButton className={className} onClick={onClickRevoke}>
    <MinusIcon />
  </RevokeButton>
);

export default RevokeAccessControl;
