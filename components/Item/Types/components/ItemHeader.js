import React, { Fragment } from 'react';
import styled from 'styled-components';
import { formatDate } from 'common/utils/dateUtils';
import { upperFirst } from 'common/utils/string';
import { Icon } from 'components/Icon';
import { Button } from 'components/Button';
import { Avatar, AvatarsList } from 'components/Avatar';
import { withOfflineDetection } from 'components/Offline';
import { Dropdown } from 'components/Dropdown';
import { TRASH_TYPE } from 'common/constants';
import { Row } from './Row';

const StyledRow = styled(Row)`
  margin-top: 10px;
  margin-bottom: 35px;
`;

const ItemButton = styled(Button)`
  margin-left: 20px;
`;

const InviteRow = styled(Row)`
  margin-top: 10px;
`;

const UpdatedDate = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.emperor};
`;

const Owner = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;

const OwnerName = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
`;

const OwnerStatus = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const StyledAvatarsList = styled(AvatarsList)`
  margin-right: 30px;

  &:last-child {
    margin-right: 0;
  }
`;

const InviteButton = styled.button`
  width: 40px;
  height: 40px;
  ${({ hasInvited }) => hasInvited && 'margin-right: -10px'};
  color: ${({ theme }) => theme.emperor};
  border: 1px dashed ${({ theme }) => theme.gallery};
  border-radius: 50%;
  outline: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;

  ${({ disabled }) =>
    !disabled &&
    `
      &:hover {
        color: ${({ theme }) => theme.black};
        border-color: ${({ theme }) => theme.emperor};
      }
  `}
`;

const ShareButton = styled(Button)`
  text-transform: uppercase;
`;

const EditButton = styled(Button)`
  padding-right: 13px;
  padding-left: 13px;
  text-transform: uppercase;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  padding: 4px 0;
  font-size: 36px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.black};
`;

const FavoriteButton = styled.button`
  align-self: flex-start;
  margin-top: 20px;
  padding: 0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background: none;
  border: none;
  outline: none;
  transition: 0.3s;

  ${({ disabled }) =>
    !disabled &&
    `
      &:hover {
        opacity: 0.75;
      }
  `}
`;

const StyledDropdown = styled(Dropdown)`
  width: 100%;
`;

const MoveTo = styled.a`
  cursor: pointer;
  height: 40px;
  font-size: 14px;
  letter-spacing: 0.4px;
  border-radius: 3px;
  outline: none;
  padding: 10px 20px;
  transition: all 0.2s;
  border: 1px solid ${({ theme }) => theme.gallery};

  &:hover {
    border: 1px solid ${({ theme }) => theme.black};
  }
`;

const ItemHeader = ({
  allLists,
  isReadOnly,
  hasWriteAccess,
  isTrashItem,
  isSharedItem,
  isOnline,
  user,
  members,
  onClickCloseItem,
  onClickRemoveItem,
  onClickEditItem,
  onClickInvite,
  onClickShare,
  onClickRestoreItem,
  onClickMoveItem,
  onToggleFavorites,
  item: {
    id: itemId,
    listId,
    lastUpdated,
    favorite,
    owner,
    data: { name },
  },
  childItems,
}) => {
  if (isSharedItem) {
    return (
      <Fragment>
        <StyledRow>
          <UpdatedDate>Last updated {formatDate(lastUpdated)}</UpdatedDate>
        </StyledRow>
        <Row>
          <Title>{name}</Title>
        </Row>
      </Fragment>
    );
  }

  const avatars = childItems.reduce((accumulator, item) => {
    if (!members[item.userId]) {
      return accumulator;
    }

    if (user.id === item.userId && user.id !== owner.id) {
      accumulator.unshift(user);
    } else if (owner.id !== item.userId) {
      accumulator.push(members[item.userId]);
    }

    return accumulator;
  }, []);

  const hasInvited = childItems.length > 0;
  const isOwner = user.id === owner.id;

  const options = allLists
    .filter(({ id, type }) => type !== TRASH_TYPE && id !== listId)
    .map(({ label, id }) => ({ value: id, label: upperFirst(label) }));

  return (
    <Fragment>
      <Row>
        <UpdatedDate>Last updated {formatDate(lastUpdated)}</UpdatedDate>
        <Row>
          {isReadOnly && (
            <StyledDropdown options={options} onClick={onClickMoveItem}>
              <MoveTo>MOVE TO</MoveTo>
            </StyledDropdown>
          )}
          {isTrashItem ? (
            <ButtonsWrapper>
              <Button
                withOfflineCheck
                color="white"
                onClick={onClickRestoreItem}
              >
                RESTORE
              </Button>
              <ItemButton
                color="white"
                icon="trash"
                onClick={onClickRemoveItem}
              >
                REMOVE
              </ItemButton>
            </ButtonsWrapper>
          ) : (
            hasWriteAccess && (
              <EditButton
                withOfflineCheck
                color="white"
                icon="pencil"
                onClick={onClickEditItem}
              >
                EDIT
              </EditButton>
            )
          )}
          <ItemButton color="white" icon="close" onClick={onClickCloseItem} />
        </Row>
      </Row>
      <Row>
        <Title>{name}</Title>
        <FavoriteButton
          disabled={!isOnline}
          onClick={onToggleFavorites(itemId)}
        >
          <Icon
            withOfflineCheck
            name={favorite ? 'favorite-active' : 'favorite'}
            width={20}
            height={20}
          />
        </FavoriteButton>
      </Row>
      <InviteRow>
        <Row>
          <Avatar
            name={owner ? owner.name : ''}
            avatar={owner ? owner.avatar : ''}
          />
          <Owner>
            <OwnerName>{owner ? owner.name : ''}</OwnerName>
            <OwnerStatus>owner</OwnerStatus>
          </Owner>
        </Row>
        <Row>
          {!isTrashItem && isOwner && (
            <InviteButton
              disabled={!isOnline}
              onClick={onClickInvite}
              hasInvited={hasInvited}
            >
              <Icon
                isInButton
                withOfflineCheck
                name="plus"
                width={14}
                height={14}
              />
            </InviteButton>
          )}
          <StyledAvatarsList avatars={avatars} />
          {!isTrashItem && isOwner && (
            <ShareButton
              withOfflineCheck
              icon="share"
              color="black"
              onClick={onClickShare}
            >
              Share
            </ShareButton>
          )}
        </Row>
      </InviteRow>
    </Fragment>
  );
};

export default withOfflineDetection(ItemHeader);
