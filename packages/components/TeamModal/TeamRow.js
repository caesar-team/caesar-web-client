import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@caesar/components';
import { Radio } from '../Radio';

const AvatarStyled = styled(Avatar)`
  margin-left: 40px;
  margin-right: 20px;
`;

const TeamDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TeamName = styled.div`
  font-size: 18px;
  color: ${({ theme, isActive }) =>
    isActive ? theme.color.white : theme.color.black};
`;

const TeamMembers = styled.div`
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  color: ${({ theme }) => theme.color.gray};
`;

const RadioStyled = styled(Radio)`
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  padding: 10px 20px;
  border-radius: 3px;
  margin-bottom: 10px;

  &:hover {
    background-color: ${({ theme, isActive }) => !isActive && theme.color.snow};
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  &:after {
    top: 22px;
    left: 22px;
  }

  ${Radio.RadioIcon} {
    top: 25px;
    left: 25px;
  }
`;

const ActivePointer = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.white};
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.color.black};
  background-color: ${({ theme }) => theme.color.black};
  margin-bottom: 10px;

  &:last-of-type {
    margin-bottom: 0;
  }

  ${TeamName} {
    color: ${({ theme }) => theme.color.white};
  }
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const ActiveTeamRow = ({ data: { id, title, icon } }) => {
  return (
    <Wrapper key={id}>
      <InnerWrapper>
        <AvatarStyled name={title} avatar={icon} />
        <TeamDetails>
          <TeamName>{title}</TeamName>
        </TeamDetails>
      </InnerWrapper>
      <ActivePointer>Active</ActivePointer>
    </Wrapper>
  );
};

export const RadioTeamRow = ({
  data: { id, title, icon },
  value,
  checked,
  onChange,
}) => (
  <RadioStyled key={id} value={value} checked={checked} onChange={onChange}>
    <AvatarStyled name={title} avatar={icon} />
    <TeamDetails>
      <TeamName>{title}</TeamName>
    </TeamDetails>
  </RadioStyled>
);
