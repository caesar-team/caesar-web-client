import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import {
  Item,
  MultiItem,
  List,
  SearchList,
  ShareModal,
  MoveModal,
  ConfirmModal,
  MenuList,
  withNotification,
  DashboardLayout,
  SecureMessage,
  FullScreenLoader,
} from 'components';
import {
  ITEM_REVIEW_MODE,
  ITEM_WORKFLOW_CREATE_MODE,
  ITEM_WORKFLOW_EDIT_MODE,
  DASHBOARD_DEFAULT_MODE,
  DASHBOARD_SEARCH_MODE,
  DASHBOARD_TOOL_MODE,
  ITEM_CREDENTIALS_TYPE,
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

const SHARE_MODAL = 'shareModal';
const MOVE_ITEM_MODAL = 'moveItem';
const MOVE_TO_TRASH_MODAL = 'moveToTrashModal';
const REMOVE_ITEM_MODAL = 'removeItemModal';

const SECRET_SEARCH_FIELDS = ['name', 'note', 'website'];

const searchFn = (obj, pattern) => fieldName =>
  obj &&
  pattern &&
  obj[fieldName] &&
  obj[fieldName].toLowerCase().includes(pattern.toLowerCase());

const getItemTypeText = item =>
  item.type === ITEM_CREDENTIALS_TYPE ? 'credential' : 'note';

class DashboardContainer extends Component {
  state = this.prepareInitialState();

  filter = memoize((data, pattern) =>
    pattern
      ? data.filter(({ data: itemsData }) =>
          SECRET_SEARCH_FIELDS.some(searchFn(itemsData, pattern)),
        )
      : data,
  );

  componentDidMount() {
    this.props.fetchUserSelfRequest();
    this.props.fetchKeyPairRequest();
    this.props.fetchUserTeamsRequest();

    // TODO: added checkpoint for situation when
    // TODO: 1) we dont have items and we need to load and decrypt them
    // TODO: 2) we have not decrypted items and we need just to decrypt them
    // TODO: 3) we have encrypted items we need to do nothing
    // withItemsDecryption = true
    this.props.initPreparationDataFlow(true);
  }

  // eslint-disable-next-line
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
    this.props.setWorkInProgressListId(null);

    this.setState({
      mode: DASHBOARD_TOOL_MODE,
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

    this.handleCloseModal(REMOVE_ITEM_MODAL)();
  };

  handleMoveToTrash = () => {
    const {
      workInProgressItemIds,
      workInProgressItem,
      workInProgressList,
    } = this.props;

    const isTeamList = !!workInProgressList.teamId;
    const trashListId = isTeamList
      ? this.props.teamTrashList.id
      : this.props.trashList.id;

    if (workInProgressItemIds.length > 0) {
      this.props.moveItemsBatchRequest(workInProgressList.id, trashListId);
      this.props.resetWorkInProgressItemIds();

      this.props.notification.show({
        text: `The items have removed`,
      });
    } else {
      this.props.moveItemRequest(trashListId);
      this.props.setWorkInProgressItem(null);

      this.props.notification.show({
        text: `The ${getItemTypeText(workInProgressItem)} has removed`,
      });
    }

    this.handleCloseModal(MOVE_TO_TRASH_MODAL)();
  };

  handleFinishCreateWorkflow = (data, { setSubmitting }) => {
    this.props.createItemRequest(data, setSubmitting);
  };

  handleClickMoveItem = (_, listId) => {
    this.props.moveItemRequest(listId);
    this.props.setWorkInProgressItem(null);

    this.props.notification.show({
      text: `The ${getItemTypeText(this.props.workInProgressItem)} has moved.`,
    });
  };

  handleFinishEditWorkflow = (data, { setSubmitting }) => {
    this.props.editItemRequest(data, setSubmitting);

    this.props.notification.show({
      text: `The ${getItemTypeText(data)} has updated`,
    });
  };

  handleToggleFavorites = id => () => {
    this.props.toggleItemToFavoriteRequest(id);
  };

  handleAcceptUpdate = id => () => {
    this.props.acceptItemUpdateRequest(id);
  };

  handleRejectUpdate = id => () => {
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

  handleChangePermission = (childItemId, permission) => {
    this.props.changeChildItemPermissionRequest(childItemId, permission);
  };

  handleActivateLink = () => {
    this.props.createAnonymousLinkRequest();
  };

  handleDeactivateLink = () => {
    this.props.removeAnonymousLinkRequest();
  };

  handleShare = (members, teamIds) => {
    const { workInProgressItem, workInProgressItemIds } = this.props;

    if (members.length > 0 || teamIds.length > 0) {
      if (workInProgressItemIds && workInProgressItemIds.length > 0) {
        this.props.shareItemBatchRequest(
          workInProgressItemIds,
          members,
          teamIds,
        );
        this.props.resetWorkInProgressItemIds();
      } else {
        this.props.shareItemBatchRequest(
          [workInProgressItem.id],
          members,
          teamIds,
        );
      }
    }

    this.handleCloseModal(SHARE_MODAL)();
  };

  handleRemoveShare = shareId => () => {
    this.props.removeShareRequest(shareId);
  };

  handleClickMoveItems = listId => {
    const { workInProgressList } = this.props;

    this.props.moveItemsBatchRequest(workInProgressList.id, listId);
    this.props.resetWorkInProgressItemIds();

    this.props.notification.show({
      text: 'The items have moved.',
    });

    this.handleCloseModal('move')();
  };

  handleOpenModal = modal => () => {
    this.setState(prevState => ({
      ...prevState,
      modalVisibilities: {
        ...prevState.modalVisibilities,
        [modal]: true,
      },
    }));
  };

  handleCloseModal = modal => () => {
    this.setState(prevState => ({
      ...prevState,
      modalVisibilities: {
        ...prevState.modalVisibilities,
        [modal]: false,
      },
    }));
  };

  handleSearch = event => {
    event.preventDefault();

    this.props.resetWorkInProgressItemIds();
    this.props.setWorkInProgressListId(null);
    this.props.setWorkInProgressItem(null);

    this.setState({
      searchedText: event.target.value,
      mode: event.target.value ? DASHBOARD_SEARCH_MODE : DASHBOARD_DEFAULT_MODE,
    });
  };

  handleClickResetSearch = () => {
    this.props.resetWorkInProgressItemIds();
    this.props.setWorkInProgressListId(null);
    this.props.setWorkInProgressItem(null);

    this.setState({
      searchedText: '',
      mode: DASHBOARD_DEFAULT_MODE,
    });
  };

  handleCtrlSelectionItemBehaviour = itemId => {
    const { workInProgressItemIds } = this.props;

    const ids = workInProgressItemIds.includes(itemId)
      ? workInProgressItemIds.filter(id => id !== itemId)
      : [...workInProgressItemIds, itemId];

    this.props.setWorkInProgressItem(null);
    this.props.setWorkInProgressItemIds(ids);
  };

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

  handleDefaultSelectionItemBehaviour(itemId) {
    this.props.resetWorkInProgressItemIds();
    this.props.setWorkInProgressItem(
      this.props.itemsById[itemId],
      ITEM_REVIEW_MODE,
    );
  }

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

  prepareInitialState() {
    return {
      startCtrlShiftSelectionItemId: null,
      mode: DASHBOARD_DEFAULT_MODE,
      searchedText: '',
      modalVisibilities: {
        [SHARE_MODAL]: false,
        [MOVE_ITEM_MODAL]: false,
        [MOVE_TO_TRASH_MODAL]: false,
        [REMOVE_ITEM_MODAL]: false,
      },
    };
  }

  render() {
    const {
      userTeamList,
      notification,
      workInProgressItem,
      workInProgressItemOwner,
      workInProgressItemSharedMembers,
      workInProgressItemChildItems,
      workInProgressItemIds,
      workInProgressList,
      membersById,
      user,
      team,
      personalLists,
      teamLists,
      personalListsByType,
      visibleListItems,
      workInProgressItems,
      itemsById,
      isLoading,
      trashList,
      teamTrashList,
    } = this.props;

    const { mode, modalVisibilities, searchedText } = this.state;

    if (isLoading) {
      return <FullScreenLoader />;
    }

    const searchedItems = this.filter(Object.values(itemsById), searchedText);

    const isTeamItem = workInProgressItem && workInProgressItem.teamId;
    const isMultiItem =
      workInProgressItemIds && workInProgressItemIds.length > 0;

    const isToolMode = mode === DASHBOARD_TOOL_MODE;

    const isTrash =
      workInProgressList &&
      (workInProgressList.id === trashList.id ||
        workInProgressList.id === teamTrashList.id);

    const areAllItemsSelected =
      mode === DASHBOARD_SEARCH_MODE
        ? searchedItems.length === workInProgressItemIds.length
        : visibleListItems.length === workInProgressItemIds.length;

    const currentLists =
      workInProgressItem && workInProgressItem.teamId
        ? teamLists
        : personalLists;

    const availableTeamsForSharing = isTeamItem
      ? userTeamList.filter(({ id }) => id !== workInProgressItem.teamId)
      : userTeamList;

    return (
      <Fragment>
        <DashboardLayout
          withSearch
          user={user}
          team={team}
          searchedText={searchedText}
          onSearch={this.handleSearch}
          onClickReset={this.handleClickResetSearch}
        >
          <CenterWrapper>
            <Sidebar>
              <MenuList
                mode={mode}
                team={team}
                inbox={personalListsByType.inbox}
                favorites={personalListsByType.favorites}
                trash={personalListsByType.trash}
                personalLists={personalListsByType.list}
                teamLists={teamLists}
                activeListId={workInProgressList && workInProgressList.id}
                onClickMenuItem={this.handleClickMenuItem}
                onClickSecureMessage={this.handleClickSecureMessage}
              />
            </Sidebar>
            {isToolMode ? (
              <SecureMessage withScroll />
            ) : (
              <Fragment>
                <MiddleColumnWrapper>
                  {isMultiItem && (
                    <MultiItem
                      isTrashItems={isTrash}
                      workInProgressItemIds={workInProgressItemIds}
                      areAllItemsSelected={areAllItemsSelected}
                      onClickMove={this.handleOpenModal(MOVE_ITEM_MODAL)}
                      onClickMoveToTrash={this.handleOpenModal(
                        MOVE_TO_TRASH_MODAL,
                      )}
                      onClickRemove={this.handleOpenModal(REMOVE_ITEM_MODAL)}
                      onClickShare={this.handleOpenModal(SHARE_MODAL)}
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
                    isTrashItem={isTrash}
                    notification={notification}
                    item={workInProgressItem}
                    owner={workInProgressItemOwner}
                    childItems={workInProgressItemChildItems}
                    allLists={currentLists}
                    user={user}
                    membersById={membersById}
                    onClickMoveItem={this.handleClickMoveItem}
                    onClickCloseItem={this.handleClickCloseItem}
                    onClickShare={this.handleOpenModal(SHARE_MODAL)}
                    onClickEditItem={this.handleClickEditItem}
                    onClickMoveToTrash={this.handleOpenModal(
                      MOVE_TO_TRASH_MODAL,
                    )}
                    onFinishCreateWorkflow={this.handleFinishCreateWorkflow}
                    onFinishEditWorkflow={this.handleFinishEditWorkflow}
                    onCancelWorkflow={this.handleClickCancelWorkflow}
                    onClickRestoreItem={this.handleClickRestoreItem}
                    onClickRemoveItem={this.handleOpenModal(REMOVE_ITEM_MODAL)}
                    onToggleFavorites={this.handleToggleFavorites}
                    onClickAcceptUpdate={this.handleAcceptUpdate}
                    onClickRejectUpdate={this.handleRejectUpdate}
                  />
                </RightColumnWrapper>
              </Fragment>
            )}
          </CenterWrapper>
        </DashboardLayout>
        {modalVisibilities[SHARE_MODAL] && (
          <ShareModal
            teams={availableTeamsForSharing}
            sharedMembers={workInProgressItemSharedMembers}
            anonymousLink={workInProgressItem && workInProgressItem.shared}
            withAnonymousLink={!isMultiItem}
            onShare={this.handleShare}
            onRemove={this.handleRemoveShare}
            onActivateLink={this.handleActivateLink}
            onDeactivateLink={this.handleDeactivateLink}
            onCancel={this.handleCloseModal(SHARE_MODAL)}
            notification={notification}
          />
        )}
        {modalVisibilities[MOVE_ITEM_MODAL] && (
          <MoveModal
            lists={currentLists}
            items={workInProgressItems}
            workInProgressListId={workInProgressList.id}
            onMove={this.handleClickMoveItems}
            onCancel={this.handleCloseModal(MOVE_ITEM_MODAL)}
            onRemove={this.handleCtrlSelectionItemBehaviour}
          />
        )}
        <ConfirmModal
          isOpen={modalVisibilities[MOVE_TO_TRASH_MODAL]}
          description="Are you sure you want to move the item(-s) to trash?"
          onClickOk={this.handleMoveToTrash}
          onClickCancel={this.handleCloseModal(MOVE_TO_TRASH_MODAL)}
        />
        <ConfirmModal
          isOpen={modalVisibilities[REMOVE_ITEM_MODAL]}
          description="Are you sure you want to delete the item(-s)?"
          onClickOk={this.handleRemoveItem}
          onClickCancel={this.handleCloseModal(REMOVE_ITEM_MODAL)}
        />
      </Fragment>
    );
  }
}

export default withNotification(DashboardContainer);
