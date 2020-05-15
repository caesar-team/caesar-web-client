import React, { forwardRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  background-color: ${({ theme }) => theme.color.white};
  cursor: pointer;

  &:hover {
    border: 1px solid ${({ theme }) => theme.color.gray};
  }
`;

const TeamIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 100%;
`;

const TeamIconImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
`;

const TeamName = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  margin: 0 10px;
`;

const TeamTag = forwardRef(({ name, icon, ...props }, ref) => (
  <Wrapper {...props} ref={ref}>
    <TeamIconWrapper>
      <TeamIconImage src={icon} />
    </TeamIconWrapper>
    <TeamName>{name}</TeamName>
  </Wrapper>
));

export default TeamTag;
