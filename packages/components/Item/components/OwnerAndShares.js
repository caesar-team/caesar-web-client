import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { PERMISSION } from '@caesar/common/constants';
import { workInProgressItemOwnerSelector } from '@caesar/common/selectors/workflow';
import { usersBatchSelector } from '@caesar/common/selectors/entities/user';
import { Hint, HINT_POSITION } from '../../Hint';
import { Can } from '../../Ability';
import { Avatar, AvatarsList } from '../../Avatar';
import { Icon } from '../../Icon';

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

const InvitedMembersWrapper = styled.div`
  ${({ resetMargin }) =>
    resetMargin &&
    `
    transform: translateX(-8px);
  `}
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
  color: ${({ theme }) => theme.color.gray};
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

export const OwnerAndShares = ({
  showShareButton,
  invited = [],
  itemSubject,
  onClickShare,
}) => {
  const owner = useSelector(workInProgressItemOwnerSelector);
  const invitedUsers = useSelector(state =>
    usersBatchSelector(state, {
      userIds: invited || [],
    }),
  );
  const hasInvited = invitedUsers?.length > 0;

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
          <OwnerStatus>Owner</OwnerStatus>
        </Owner>
      </OwnerWrapper>
      <Can I={PERMISSION.SHARE} an={itemSubject} passThrough>
        {allowed => (
          <InvitedMembersWrapper resetMargin={!allowed || !showShareButton}>
            {hasInvited ? (
              // TODO: Why avatars have the member object? The wrong name of property.
              <AvatarsList
                avatars={invitedUsers}
                avatarHintPosition="top_left"
              />
            ) : (
              <NoMembers>
                <Icon name="members" width={16} height={16} color="lightGray" />
              </NoMembers>
            )}
          </InvitedMembersWrapper>
        )}
      </Can>
      {showShareButton && (
        <Can I={PERMISSION.SHARE} an={itemSubject}>
          <Hint text="Share the item" position={HINT_POSITION.TOP_LEFT}>
            <ShareButton
              // disabled={!isOnline}
              onClick={onClickShare}
            >
              <Icon withOfflineCheck name="plus" width={16} height={16} />
            </ShareButton>
          </Hint>
        </Can>
      )}
    </Wrapper>
  );
};
