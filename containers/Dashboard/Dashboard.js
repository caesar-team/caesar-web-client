import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import {
  Item,
  MultiItem,
  List,
  InviteModal,
  ShareModal,
  ConfirmModal,
  MenuList,
  withNotification,
  DashboardLayout,
  SecureMessage,
  TextLoader,
} from 'components';
import {
  ITEM_REVIEW_MODE,
  ITEM_WORKFLOW_CREATE_MODE,
  ITEM_WORKFLOW_EDIT_MODE,
} from 'common/constants';
import { initialItemData } from './utils';

const MiddleColumnWrapper = styled.div`
  width: 400px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.lightBlue};
  border-right: 1px solid ${({ theme }) => theme.gallery};
`;

const RightColumnWrapper = styled.div`
  position: relative;
  flex-grow: 1;
`;

const CenterWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 70px);
`;

const Sidebar = styled.aside`
  width: 300px;
  flex-shrink: 0;
  border-right: 1px solid ${({ theme }) => theme.gallery};
`;

const SECURE_MESSAGE_MODE = 'SECURE_MESSAGE_MODE';
const LIST_ITEM_MODE = 'LIST_ITEM_MODE';

class DashboardContainer extends Component {
  state = this.prepareInitialState();

  componentDidMount() {
    this.props.fetchUserSelfRequest();
    this.props.fetchKeyPairRequest();
    this.props.fetchNodesRequest();
    this.props.fetchMembersRequest();
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  handleClickMenuItem = id => () => {
    this.props.setWorkInProgressListId(id);
    this.props.setWorkInProgressItem(null);
    this.props.resetWorkInProgressItemIds();

    this.setState({
      mode: LIST_ITEM_MODE,
    });
  };

  handleClickSecureMessage = () => {
    this.setState({
      mode: SECURE_MESSAGE_MODE,
    });
  };

  handleClickItem = itemId => event => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
      this.handleCtrlShiftSelectionItemBehaviour(itemId);
    } else if (event.ctrlKey || event.metaKey) {
      this.handleCtrlSelectionItemBehaviour(itemId);
    } else {
      this.handleDefaultSelectionItemBehaviour(itemId);
    }
  };

  handleClickCreateItem = (name, type) => {
    this.props.resetWorkInProgressItemIds();
    this.props.setWorkInProgressItem(
      initialItemData(type, this.props.workInProgressList.id),
      ITEM_WORKFLOW_CREATE_MODE,
    );
  };

  handleClickEditItem = () => {
    this.props.setWorkInProgressItem(
      this.props.workInProgressItem,
      ITEM_WORKFLOW_EDIT_MODE,
    );
  };

  handleRemoveItem = () => {
    const { workInProgressItemIds } = this.props;

    if (workInProgressItemIds.length > 0) {
      this.props.removeItems();
      this.props.resetWorkInProgressItemIds();
    } else {
      this.props.removeItemRequest(
        this.props.workInProgressItem.id,
        this.props.workInProgressItem.listId,
      );
      this.props.setWorkInProgressItem(null);
    }

    this.handleCloseModal('removeItem')();
  };

  handleMoveToTrash = () => {
    const { workInProgressItemIds } = this.props;

    if (workInProgressItemIds.length > 0) {
      this.props.moveItems(this.props.listsByType.trash.id);
      this.props.resetWorkInProgressItemIds();
    } else {
      this.props.moveItemRequest(this.props.listsByType.trash.id);
      this.props.setWorkInProgressItem(null);
    }

    this.handleCloseModal('moveToTrash')();
  };

  handleFinishCreateWorkflow = (data, { setSubmitting }) => {
    this.props.createItemRequest(data, setSubmitting);
  };

  handleClickMoveItem = (_, listId) => {
    this.props.moveItemRequest(listId);
    this.props.setWorkInProgressItem(null);
  };

  handleFinishEditWorkflow = (data, { setSubmitting }) => {
    this.props.editItemRequest(data, setSubmitting);
  };

  handleToggleFavorites = id => () => {
    this.props.toggleItemToFavoriteRequest(id);
  };

  handleAcceptUpdate = id => () => {
    this.props.acceptItemUpdateRequest(id);
  };

  handleRejectUpdate = id => async () => {
    this.props.rejectItemUpdateRequest(id);
  };

  handleClickCancelWorkflow = () => {
    const { workInProgressItem } = this.props;

    this.props.setWorkInProgressItem(
      workInProgressItem.mode === ITEM_WORKFLOW_EDIT_MODE
        ? workInProgressItem
        : null,
      workInProgressItem.mode === ITEM_WORKFLOW_EDIT_MODE
        ? ITEM_REVIEW_MODE
        : null,
    );
  };

  handleClickRestoreItem = async () => {
    this.props.moveItemRequest(this.props.workInProgressItem.previousListId);
    this.props.setWorkInProgressItem(null);
  };

  handleClickCloseItem = () => {
    this.props.setWorkInProgressItem(null);
  };

  handleInviteMember = userId => {
    this.props.inviteMemberRequest(userId);
  };

  handleAddNewMember = email => {
    this.props.inviteNewMemberRequest(email);
  };

  handleChangePermission = (userId, permission) => {
    this.props.changeItemPermissionRequest(userId, permission);
  };

  handleRemoveInvite = userId => {
    this.props.removeInviteMemberRequest(userId);
  };

  handleActivateShareByLink = () => {
    this.props.createAnonymousLinkRequest();
  };

  handleDeactivateShareByLink = () => {
    this.props.removeAnonymousLinkRequest();
  };

  handleShare = emails => {
    const { workInProgressItem, workInProgressItemIds } = this.props;

    if (emails.length > 0) {
      if (workInProgressItemIds && workInProgressItemIds.length > 0) {
        this.props.shareItems(emails);
        this.props.resetWorkInProgressItemIds();
      } else {
        this.props.shareItemRequest(workInProgressItem, emails);
      }
    }

    this.handleCloseModal('share')();
  };

  handleRemoveShare = shareId => () => {
    this.props.removeShareRequest(shareId);
  };

  handleClickMoveItems = (_, listId) => {
    this.props.moveItems(listId);
    this.props.resetWorkInProgressItemIds();
  };

  handleOpenModal = modal => () => {
    this.setState(prevState => ({
      ...prevState,
      modals: {
        ...prevState.modals,
        [modal]: true,
      },
    }));
  };

  handleCloseModal = modal => () => {
    this.setState(prevState => ({
      ...prevState,
      modals: {
        ...prevState.modals,
        [modal]: false,
      },
    }));
  };

  handleCtrlShiftSelectionItemBehaviour(itemId) {
    const { visibleListItems } = this.props;
    const { startCtrlShiftSelectionItemId } = this.state;

    if (!startCtrlShiftSelectionItemId) {
      this.setState({
        startCtrlShiftSelectionItemId: itemId,
      });

      this.props.setWorkInProgressItem(null);
      this.props.setWorkInProgressItemIds([itemId]);
    } else {
      this.setState({
        startCtrlShiftSelectionItemId: null,
      });

      const startIndex = visibleListItems.findIndex(
        ({ id }) => id === startCtrlShiftSelectionItemId,
      );
      const endIndex = visibleListItems.findIndex(({ id }) => id === itemId);

      const slicedItems = visibleListItems.slice(
        Math.min(startIndex, endIndex),
        Math.max(startIndex, endIndex) + 1,
      );

      this.props.setWorkInProgressItemIds(slicedItems.map(({ id }) => id));
    }
  }

  handleCtrlSelectionItemBehaviour(itemId) {
    const { workInProgressItemIds } = this.props;

    const ids = workInProgressItemIds.includes(itemId)
      ? workInProgressItemIds.filter(id => id !== itemId)
      : [...workInProgressItemIds, itemId];

    this.props.setWorkInProgressItem(null);
    this.props.setWorkInProgressItemIds(ids);
  }

  handleDefaultSelectionItemBehaviour(itemId) {
    this.props.resetWorkInProgressItemIds();
    this.props.setWorkInProgressItem(
      this.props.itemsById[itemId],
      ITEM_REVIEW_MODE,
    );
  }

  prepareInitialState() {
    return {
      startCtrlShiftSelectionItemId: null,
      mode: LIST_ITEM_MODE,
      modals: {
        invite: false,
        share: false,
        moveToTrash: false,
        removeItem: false,
      },
    };
  }

  render() {
    const {
      notification,
      workInProgressItem,
      workInProgressItemIds,
      workInProgressList,
      members,
      user,
      lists,
      listsByType,
      visibleListItems,
      isLoading,
      trashList,
    } = this.props;

    const { mode, modals } = this.state;

    if (isLoading) {
      return <TextLoader />;
    }

    const isMultiItem =
      workInProgressItemIds && workInProgressItemIds.length > 0;
    const isSecureMessageMode = mode === SECURE_MESSAGE_MODE;

    const isTrashList =
      workInProgressList && workInProgressList.id === trashList.id;
    const isTrashItem =
      workInProgressItem && workInProgressItem.listId === listsByType.trash.id;

    return (
      <Fragment>
        <DashboardLayout user={user} withSearch>
          <CenterWrapper>
            <Sidebar>
              <MenuList
                mode={mode}
                workInProgressList={workInProgressList}
                lists={listsByType}
                onClick={this.handleClickMenuItem}
                onClickSecureMessage={this.handleClickSecureMessage}
              />
            </Sidebar>
            {isSecureMessageMode ? (
              <SecureMessage />
            ) : (
              <Fragment>
                <MiddleColumnWrapper>
                  <List
                    isMultiItem={isMultiItem}
                    workInProgressList={workInProgressList}
                    workInProgressItem={workInProgressItem}
                    workInProgressItemIds={workInProgressItemIds}
                    items={visibleListItems}
                    onClickItem={this.handleClickItem}
                    onClickCreateItem={this.handleClickCreateItem}
                  />
                </MiddleColumnWrapper>
                <RightColumnWrapper>
                  {isMultiItem ? (
                    <MultiItem
                      isTrashItems={isTrashList}
                      workInProgressItemIds={workInProgressItemIds}
                      allLists={lists}
                      onClickMove={this.handleClickMoveItems}
                      onClickMoveToTrash={this.handleOpenModal('moveToTrash')}
                      onClickRemove={this.handleOpenModal('removeItem')}
                      onClickShare={this.handleOpenModal('share')}
                    />
                  ) : (
                    <Item
                      isTrashItem={isTrashItem}
                      notification={notification}
                      item={workInProgressItem}
                      allLists={lists}
                      user={user}
                      members={members}
                      onClickMoveItem={this.handleClickMoveItem}
                      onClickCloseItem={this.handleClickCloseItem}
                      onClickInvite={this.handleOpenModal('invite')}
                      onClickShare={this.handleOpenModal('share')}
                      onClickEditItem={this.handleClickEditItem}
                      onClickMoveToTrash={this.handleOpenModal('moveToTrash')}
                      onFinishCreateWorkflow={this.handleFinishCreateWorkflow}
                      onFinishEditWorkflow={this.handleFinishEditWorkflow}
                      onCancelWorkflow={this.handleClickCancelWorkflow}
                      onClickRestoreItem={this.handleClickRestoreItem}
                      onClickRemoveItem={this.handleOpenModal('removeItem')}
                      onToggleFavorites={this.handleToggleFavorites}
                      onClickAcceptUpdate={this.handleAcceptUpdate}
                      onClickRejectUpdate={this.handleRejectUpdate}
                    />
                  )}
                </RightColumnWrapper>
              </Fragment>
            )}
          </CenterWrapper>
        </DashboardLayout>
        {modals.invite && (
          <InviteModal
            members={members}
            invited={workInProgressItem.invited}
            onClickInvite={this.handleInviteMember}
            onClickAddNewMember={this.handleAddNewMember}
            onChangePermission={this.handleChangePermission}
            onRemoveInvite={this.handleRemoveInvite}
            onCancel={this.handleCloseModal('invite')}
          />
        )}
        {modals.share && (
          <ShareModal
            withAnonymousLink={!isMultiItem}
            shared={(workInProgressItem && workInProgressItem.shared) || []}
            onShare={this.handleShare}
            onRemove={this.handleRemoveShare}
            onActivateSharedByLink={this.handleActivateShareByLink}
            onDeactivateSharedByLink={this.handleDeactivateShareByLink}
            onCancel={this.handleCloseModal('share')}
            notification={notification}
          />
        )}
        <ConfirmModal
          isOpen={modals.moveToTrash}
          description="Are you sure you want to move the item(-s) to trash?"
          onClickOk={this.handleMoveToTrash}
          onClickCancel={this.handleCloseModal('moveToTrash')}
        />
        <ConfirmModal
          isOpen={modals.removeItem}
          description="Are you sure you want to delete the item(-s)?"
          onClickOk={this.handleRemoveItem}
          onClickCancel={this.handleCloseModal('removeItem')}
        />
      </Fragment>
    );
  }
}

export default withNotification(DashboardContainer);
