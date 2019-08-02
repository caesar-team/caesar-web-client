import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import debounce from 'debounce';
import {
  Item,
  MultiItem,
  List,
  SearchList,
  InviteModal,
  ShareModal,
  ConfirmModal,
  MenuList,
  withNotification,
  DashboardLayout,
  SecureMessage,
  TextLoader,
  FullScreenLoader,
} from 'components';
import {
  ITEM_REVIEW_MODE,
  ITEM_WORKFLOW_CREATE_MODE,
  ITEM_WORKFLOW_EDIT_MODE,
  DASHBOARD_DEFAULT_MODE,
  DASHBOARD_SEARCH_MODE,
  DASHBOARD_SECURE_MESSAGE_MODE,
} from 'common/constants';
import { initialItemData } from './utils';

const MiddleColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const SECRET_SEARCH_FIELDS = ['name', 'note', 'website'];

const searchFn = (obj, pattern) => fieldName =>
  pattern &&
  obj[fieldName] &&
  obj[fieldName].toLowerCase().includes(pattern.toLowerCase());

class DashboardContainer extends Component {
  state = this.prepareInitialState();

  filter = memoize((data, pattern) =>
    pattern
      ? data.filter(({ secret }) =>
          SECRET_SEARCH_FIELDS.some(searchFn(secret, pattern)),
        )
      : data,
  );

  componentDidMount() {
    this.props.fetchUserSelfRequest();
    this.props.fetchKeyPairRequest();

    // withItemsDecryption = true
    this.props.fetchNodesRequest(true);
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
      mode: DASHBOARD_DEFAULT_MODE,
      searchedText: '',
    });
  };

  handleClickSecureMessage = () => {
    this.setState({
      mode: DASHBOARD_SECURE_MESSAGE_MODE,
      searchedText: '',
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
    const { workInProgressItemIds, workInProgressList } = this.props;

    if (workInProgressItemIds.length > 0) {
      this.props.removeItemsBatchRequest(workInProgressList.id);
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
    const { workInProgressItemIds, workInProgressList } = this.props;

    if (workInProgressItemIds.length > 0) {
      this.props.moveItemsBatchRequest(
        workInProgressList.id,
        this.props.listsByType.trash.id,
      );
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
    const { workInProgressList } = this.props;

    this.props.moveItemsBatchRequest(workInProgressList.id, listId);
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

  handleSearch = event => {
    event.preventDefault();

    this.props.resetWorkInProgressItemIds();

    this.setState({
      searchedText: event.target.value,
      mode: event.target.value ? DASHBOARD_SEARCH_MODE : DASHBOARD_DEFAULT_MODE,
    });
  };

  // eslint-disable-next-line react/sort-comp
  debouncedOnSearch = debounce(this.handleSearch, 250);

  handleClickResetSearch = () => {
    this.props.resetWorkInProgressItemIds();

    this.setState({
      searchedText: '',
      mode: DASHBOARD_DEFAULT_MODE,
    });
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

  handleSelectAllListItems = event => {
    const { checked } = event.currentTarget;
    const { visibleListItems, itemsById } = this.props;
    const { searchedText, mode } = this.state;

    if (mode === DASHBOARD_SEARCH_MODE) {
      this.props.setWorkInProgressItemIds(
        checked
          ? this.filter(Object.values(itemsById), searchedText).map(
              ({ id }) => id,
            )
          : [],
      );
    } else {
      this.props.setWorkInProgressItemIds(
        checked ? visibleListItems.map(({ id }) => id) : [],
      );
    }
  };

  prepareInitialState() {
    return {
      startCtrlShiftSelectionItemId: null,
      mode: DASHBOARD_DEFAULT_MODE,
      searchedText: '',
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
      itemsById,
      isLoading,
      trashList,
    } = this.props;

    const { mode, modals, searchedText } = this.state;

    if (isLoading) {
      return <FullScreenLoader />;
    }

    const searchedItems = this.filter(Object.values(itemsById), searchedText);

    const isMultiItem =
      workInProgressItemIds && workInProgressItemIds.length > 0;
    const isSecureMessageMode = mode === DASHBOARD_SECURE_MESSAGE_MODE;

    const isTrashList =
      workInProgressList && workInProgressList.id === trashList.id;
    const isTrashItem =
      workInProgressItem && workInProgressItem.listId === listsByType.trash.id;

    const areAllItemsSelected =
      mode === DASHBOARD_SEARCH_MODE
        ? searchedItems.length === workInProgressItemIds.length
        : visibleListItems.length === workInProgressItemIds.length;

    return (
      <Fragment>
        <DashboardLayout
          withSearch
          user={user}
          searchedText={searchedText}
          onSearch={this.handleSearch}
          onClickReset={this.handleClickResetSearch}
        >
          <CenterWrapper>
            <Sidebar>
              <MenuList
                mode={mode}
                workInProgressList={workInProgressList}
                inbox={listsByType.inbox}
                favorites={listsByType.favorites}
                list={listsByType.list}
                trash={listsByType.trash}
                onClick={this.handleClickMenuItem}
                onClickSecureMessage={this.handleClickSecureMessage}
              />
            </Sidebar>
            {isSecureMessageMode ? (
              <SecureMessage />
            ) : (
              <Fragment>
                <MiddleColumnWrapper>
                  {isMultiItem && (
                    <MultiItem
                      isTrashItems={isTrashList}
                      workInProgressItemIds={workInProgressItemIds}
                      allLists={lists}
                      areAllItemsSelected={areAllItemsSelected}
                      onClickMove={this.handleClickMoveItems}
                      onClickMoveToTrash={this.handleOpenModal('moveToTrash')}
                      onClickRemove={this.handleOpenModal('removeItem')}
                      onClickShare={this.handleOpenModal('share')}
                      onSelectAll={this.handleSelectAllListItems}
                    />
                  )}
                  {mode === DASHBOARD_DEFAULT_MODE ? (
                    <List
                      isMultiItem={isMultiItem}
                      workInProgressList={workInProgressList}
                      workInProgressItem={workInProgressItem}
                      workInProgressItemIds={workInProgressItemIds}
                      items={visibleListItems}
                      onClickItem={this.handleClickItem}
                      onClickCreateItem={this.handleClickCreateItem}
                    />
                  ) : (
                    <SearchList
                      isMultiItem={isMultiItem}
                      items={searchedItems}
                      workInProgressItem={workInProgressItem}
                      workInProgressItemIds={workInProgressItemIds}
                      onClickItem={this.handleClickItem}
                    />
                  )}
                </MiddleColumnWrapper>
                <RightColumnWrapper>
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
