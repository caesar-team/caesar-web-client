import React, { Fragment } from 'react';
import styled from 'styled-components';
import { formatDate } from 'common/utils/dateFormatter';
import { Icon } from 'components/Icon';
import { Button } from 'components/Button';
import { Avatar, AvatarsList } from 'components/Avatar';
import { Row } from './Row';

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
`;

const InviteButton = styled.button`
  width: 40px;
  height: 40px;
  margin-right: -10px;
  color: ${({ theme }) => theme.emperor};
  border: 1px dashed ${({ theme }) => theme.gallery};
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.black};
    border-color: ${({ theme }) => theme.emperor};
  }
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
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  transition: 0.3s;

  &:hover {
    opacity: 0.75;
  }
`;

export const ItemHeader = ({
  isTrashItem,
  user,
  members,
  onClickCloseItem,
  onClickRemoveItem,
  onClickEditItem,
  onClickInvite,
  onClickRestoreItem,
  onToggleFavorites,
  item: {
    id: itemId,
    lastUpdated,
    invited,
    favorite,
    ownerId,
    secret: { name },
  },
}) => {
  const avatars = invited.reduce((accumulator, item) => {
    if (user.id === item.userId) {
      accumulator.unshift(user);
    } else {
      accumulator.push(members[item.userId]);
    }

    return accumulator;
  }, []);
  const owner = user.id === ownerId ? user : members[ownerId];

  return (
    <Fragment>
      <Row>
        <UpdatedDate>Last updated {formatDate(lastUpdated)}</UpdatedDate>
        <Row>
          {isTrashItem ? (
            <ButtonsWrapper>
              <Button color="white" onClick={onClickRestoreItem}>
                Restore
              </Button>
              <ItemButton
                color="white"
                icon="trash"
                onClick={onClickRemoveItem}
              >
                Remove
              </ItemButton>
            </ButtonsWrapper>
          ) : (
            <EditButton color="white" icon="pencil" onClick={onClickEditItem}>
              Edit
            </EditButton>
          )}
          <ItemButton color="white" icon="close" onClick={onClickCloseItem} />
        </Row>
      </Row>
      <Row>
        <Title>{name}</Title>
        <FavoriteButton onClick={onToggleFavorites(itemId)}>
          <Icon
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
          {!isTrashItem && (
            <InviteButton onClick={onClickInvite}>
              <Icon name="plus" width={14} height={14} isInButton />
            </InviteButton>
          )}
          <StyledAvatarsList avatars={avatars} />
          {/* TODO: Uncomment to show share btn */}
          {/* {!isTrashItem && <ShareButton color="black">Share</ShareButton>} */}
        </Row>
      </InviteRow>
    </Fragment>
  );
};
