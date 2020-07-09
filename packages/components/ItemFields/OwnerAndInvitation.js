import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { userDataSelector } from '@caesar/common/selectors/user';
import {
  workInProgressItemOwnerSelector,
  workInProgressItemChildItemsSelector,
} from '@caesar/common/selectors/workflow';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import { Avatar, AvatarsList } from '../Avatar';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const OwnerWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 0;
  margin-right: auto;
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

const NoMembers = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.basic};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-right: -8px;
  background-color: ${({ theme }) => theme.color.alto};
  border-radius: 50%;
`;

const ShareButton = styled.button`
  width: 40px;
  height: 40px;
  padding: 0;
  color: ${({ theme }) => theme.color.emperor};
  background-color: ${({ theme }) => theme.color.white};
  border: 1px dashed ${({ theme }) => theme.color.gallery};
  border-radius: 50%;
  outline: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;

  ${({ disabled, theme }) =>
    !disabled &&
    `
      &:hover {
        color: ${theme.color.black};
        border-color: ${theme.color.emperor};
      }
  `}
`;

export const OwnerAndInvitation = ({ onClickShare }) => {
  const user = useSelector(userDataSelector);
  const owner = useSelector(workInProgressItemOwnerSelector);
  const childItems = useSelector(workInProgressItemChildItemsSelector);
  const membersById = useSelector(membersByIdSelector);

  const hasInvited = childItems.length > 0;

  const avatars = childItems.reduce((accumulator, childItem) => {
    if (!membersById[childItem.userId]) {
      return accumulator;
    }

    if (user.id === childItem.userId && user.id !== owner.id) {
      accumulator.unshift(user);
    } else if (owner.id !== childItem.userId) {
      accumulator.push(membersById[childItem.userId]);
    }

    return accumulator;
  }, []);

  return (
    <Wrapper>
      <OwnerWrapper>
        <Avatar
          name={owner?.name || ''}
          email={owner?.email || ''}
          avatar={owner?.avatar || ''}
        />
        <Owner>
          <OwnerName>{owner ? owner.name : ''}</OwnerName>
          <OwnerStatus>owner</OwnerStatus>
        </Owner>
      </OwnerWrapper>
      {hasInvited ? (
        <AvatarsList avatars={avatars} />
      ) : (
        <NoMembers>
          <Icon name="members" width={16} height={16} color="lightGray" />
        </NoMembers>
      )}
      <ShareButton onClick={onClickShare}>
        <Icon withOfflineCheck name="plus" width={16} height={16} />
      </ShareButton>
    </Wrapper>
  );
};
