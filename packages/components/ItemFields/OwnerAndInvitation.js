import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { workInProgressItemOwnerSelector } from '@caesar/common/selectors/workflow';
import { Avatar } from '@caesar/components/Avatar';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 0;
`;

const Owner = styled.div`
  margin-left: 16px;
`;

const OwnerName = styled.div`
  color: ${({ theme }) => theme.color.black};
`;

const OwnerStatus = styled.div`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.gray};
`;

export const OwnerAndInvitation = () => {
  const owner = useSelector(workInProgressItemOwnerSelector);

  return (
    <Wrapper>
      <Avatar
        name={owner ? owner.name : ''}
        avatar={owner ? owner.avatar : ''}
      />
      <Owner>
        <OwnerName>{owner ? owner.name : ''}</OwnerName>
        <OwnerStatus>owner</OwnerStatus>
      </Owner>
    </Wrapper>
  );
};
