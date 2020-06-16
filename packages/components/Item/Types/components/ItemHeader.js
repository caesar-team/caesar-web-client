import React, { Component } from 'react';
import styled from 'styled-components';
import { formatDate } from '@caesar/common/utils/dateUtils';
import { upperFirst } from '@caesar/common/utils/string';
import { Icon } from '@caesar/components/Icon';
import { Button } from '@caesar/components/Button';
import { Avatar, AvatarsList } from '@caesar/components/Avatar';
import { withOfflineDetection } from '@caesar/components/Offline';
import { Dropdown } from '@caesar/components/Dropdown';
import { Can, AbilityContext } from '@caesar/components/Ability';
import {
  MOVE_ITEM_PERMISSION,
  DELETE_PERMISSION,
  UPDATE_PERMISSION,
  SHARE_ITEM_PERMISSION,
} from '@caesar/common/constants';
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
  color: ${({ theme }) => theme.color.emperor};
`;

const Owner = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;

const OwnerName = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.color.black};
`;

const OwnerStatus = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
`;

const StyledAvatarsList = styled(AvatarsList)`
  margin-right: 30px;

  &:last-child {
    margin-right: 0;
  }
`;

const ShareButton = styled.button`
  width: 40px;
  height: 40px;
  ${({ hasInvited }) => hasInvited && 'margin-right: -10px'};
  color: ${({ theme }) => theme.color.emperor};
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
  color: ${({ theme }) => theme.color.black};
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

const IconStyled = styled(Icon)`
  fill: ${({ theme }) => theme.color.gray};

  &:hover {
    fill: ${({ theme }) => theme.color.black};
  }
`;

const ArrowIcon = styled(IconStyled)`
  width: 10px;
  height: 6px;
`;

const DropdownStyled = styled(Dropdown)`
  ${Dropdown.Button} {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
  }
`;

const DropdownValue = styled.div`
  font-size: 16px;
  margin-right: 10px;
`;

const Separator = styled.div`
  font-size: 16px;
  margin: 0 20px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
`;

const TeamAvatar = styled.div`
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  margin-right: 10px;
`;

const TeamImg = styled.img`
  object-fit: cover;
  width: 20px;
  height: 20px;
`;

const MoveButton = styled(Button)`
  margin-left: 20px;
`;

const generateListOptions = (lists, currentListId) =>
  lists
    .filter(({ id }) => id !== currentListId)
    .map(({ id, label }) => ({ value: id, label: upperFirst(label) }));

const generateTeamOptions = (teams, currentTeamId) =>
  teams
    .filter(({ id }) => id !== currentTeamId)
    .map(team => ({
      value: team.id,
      label: team.id === 'personal' ? 'personal' : team.name,
    }));

const renderOption = teams => (value, label) => {
  // eslint-disable-next-line
  const team = teams.find(team => team.id === value);
  const shouldShowAvatar = value !== 'personal';

  return (
    <Option>
      {shouldShowAvatar && (
        <TeamAvatar>
          <TeamImg src={team.icon} />
        </TeamAvatar>
      )}
      {label}
    </Option>
  );
};

class ItemHeader extends Component {
  state = this.prepareInitialState();

  handleSelectTeamId = (_, teamId) => {
    const { teamsLists } = this.props;

    const currentTeam = teamsLists.find(team =>
      teamId ? team.id === teamId : team.id === 'personal',
    );

    const defaultList = currentTeam.lists.find(
      list => list.label.toLowerCase() === 'default',
    );

    this.setState({
      currentTeamId: teamId,
      currentListId: defaultList.id,
    });
  };

  handleSelectListId = (_, listId) => {
    this.setState({
      currentListId: listId,
    });
  };

  handleClickMoveItem = () => {
    const { currentTeamId, currentListId } = this.state;
    const { onClickMoveItem = Function.prototype } = this.props;

    onClickMoveItem(currentTeamId, currentListId);
  };

  prepareInitialState() {
    const {
      item: { teamId, listId },
    } = this.props;

    return {
      currentTeamId: teamId,
      currentListId: listId,
    };
  }

  render() {
    const {
      isReadOnly,
      hasWriteAccess,
      isTrashItem,
      isSharedItem,
      isOnline,
      user,
      owner,
      membersById,
      teamsLists,
      onClickCloseItem,
      onClickRemoveItem,
      onClickEditItem,
      onClickShare,
      onClickRestoreItem,
      onToggleFavorites,
      item,
      childItems,
    } = this.props;
    const { currentTeamId, currentListId } = this.state;

    const {
      id: itemId,
      teamId,
      listId,
      lastUpdated,
      favorite,
      ownerId,
      data: { name },
    } = item;

    if (isSharedItem) {
      return (
        <>
          <StyledRow>
            <UpdatedDate>Last updated {formatDate(lastUpdated)}</UpdatedDate>
          </StyledRow>
          <Row>
            <Title>{name}</Title>
          </Row>
        </>
      );
    }

    const avatars = childItems.reduce((accumulator, childItem) => {
      if (!membersById[childItem.userId]) {
        return accumulator;
      }

      if (user.id === childItem.userId && user.id !== ownerId) {
        accumulator.unshift(user);
      } else if (ownerId !== childItem.userId) {
        accumulator.push(membersById[childItem.userId]);
      }

      return accumulator;
    }, []);

    const hasInvited = childItems.length > 0;
    const isOwner = user.id === ownerId;

    const currentTeam = teamsLists.find(team =>
      currentTeamId ? team.id === currentTeamId : team.id === 'personal',
    );
    const currentList = currentTeam.lists.find(
      list => list.id === currentListId,
    );

    const teamOptions = generateTeamOptions(teamsLists, currentTeam.id);
    const listOptions = generateListOptions(currentTeam.lists, currentListId);

    const shouldShowTeamDropdownIcon =
      this.context.can(MOVE_ITEM_PERMISSION, item) && teamOptions.length >= 1;

    const shouldShowListDropdownIcon =
      this.context.can(MOVE_ITEM_PERMISSION, item) && listOptions.length >= 1;

    const shouldShowMoveButton =
      listId !== currentListId || (teamId && teamId !== currentTeamId);

    const currentTeamTag =
      currentTeam.id === 'personal' ? 'personal' : currentTeam.name;

    return (
      <>
        <Row>
          <Row>
            {!isTrashItem && (
              <>
                {shouldShowTeamDropdownIcon ? (
                  <DropdownStyled
                    onClick={this.handleSelectTeamId}
                    options={teamOptions}
                    optionRender={renderOption(teamsLists)}
                  >
                    {currentTeam.id !== 'personal' && (
                      <TeamAvatar>
                        <TeamImg src={currentTeam.icon} />
                      </TeamAvatar>
                    )}
                    <DropdownValue>{currentTeamTag}</DropdownValue>
                    <ArrowIcon name="arrow-triangle" />
                  </DropdownStyled>
                ) : (
                  <>
                    {currentTeam.id !== 'personal' && (
                      <TeamAvatar>
                        <TeamImg src={currentTeam.icon} />
                      </TeamAvatar>
                    )}
                    <DropdownValue>{currentTeamTag}</DropdownValue>
                  </>
                )}
                <Separator>|</Separator>
                {shouldShowListDropdownIcon ? (
                  <DropdownStyled
                    onClick={this.handleSelectListId}
                    options={listOptions}
                  >
                    <DropdownValue>{currentList.label}</DropdownValue>
                    <ArrowIcon name="arrow-triangle" />
                  </DropdownStyled>
                ) : (
                  <DropdownValue>{currentList.label}</DropdownValue>
                )}
                {shouldShowMoveButton && (
                  <MoveButton color="white" onClick={this.handleClickMoveItem}>
                    MOVE
                  </MoveButton>
                )}
              </>
            )}
          </Row>
          <Row>
            {isTrashItem ? (
              <ButtonsWrapper>
                <Can I={MOVE_ITEM_PERMISSION} of={item}>
                  <Button
                    withOfflineCheck
                    color="white"
                    onClick={onClickRestoreItem}
                  >
                    RESTORE
                  </Button>
                </Can>
                <Can I={DELETE_PERMISSION} of={item}>
                  <ItemButton
                    color="white"
                    icon="trash"
                    onClick={onClickRemoveItem}
                  >
                    REMOVE
                  </ItemButton>
                </Can>
              </ButtonsWrapper>
            ) : (
              hasWriteAccess && (
                <Can I={UPDATE_PERMISSION} of={item}>
                  <EditButton
                    withOfflineCheck
                    color="white"
                    icon="pencil"
                    onClick={onClickEditItem}
                  >
                    EDIT
                  </EditButton>
                </Can>
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
            <IconStyled
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
              <Can I={SHARE_ITEM_PERMISSION} of={item}>
                <ShareButton
                  disabled={!isOnline}
                  onClick={onClickShare}
                  hasInvited={hasInvited}
                >
                  <Icon withOfflineCheck name="plus" width={14} height={14} />
                </ShareButton>
              </Can>
            )}
            <StyledAvatarsList avatars={avatars} />
          </Row>
        </InviteRow>
      </>
    );
  }
}

ItemHeader.contextType = AbilityContext;

export default withOfflineDetection(ItemHeader);
