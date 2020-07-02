import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Avatar } from '../../Avatar';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: 40px;
  cursor: pointer;
`;

const Title = styled.div`
  align-self: center;
  padding: 0 16px 0 48px;
  white-space: nowrap;
`;

const StyledAvatar = styled(Avatar)`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-1px, -1px);
`;

const MinusIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.color.black};
  transform: translate(-1px, -1px);
  border-radius: 50%;

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    content: '';
    width: 16px;
    height: 2px;
    background-color: ${({ theme }) => theme.color.white};
    transform: translate(-50%, -50%);
  }
`;

export const Team = forwardRef(
  ({ team, isActive, onClick, className }, ref) => (
    <Wrapper onClick={onClick} ref={ref} className={className}>
      {isActive ? <MinusIcon /> : <StyledAvatar avatar={team.icon} />}
      <Title>{team.title}</Title>
    </Wrapper>
  ),
);
