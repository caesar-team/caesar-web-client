import React, { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  isLoadingSelector,
  workInProgressItemIdsSelector,
} from '@caesar/common/selectors/workflow';
import {
  fetchUserSelfRequest,
  fetchUserTeamsRequest,
} from '@caesar/common/actions/user';
import {
  initWorkflow,
  setWorkInProgressItem,
  setWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import {
  Item,
  MenuList,
  withNotification,
  DashboardLayout,
  SecureMessage,
  FullScreenLoader,
} from '@caesar/components';
import { DASHBOARD_MODE } from '@caesar/common/constants';
import {
  MiddleColumn,
  ShareModal,
  MoveModal,
  ConfirmMoveToTrashModal,
  ConfirmRemoveItemModal,
} from './components';
import { MODAL } from './constants';

const CenterWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 55px);
`;

const Sidebar = styled.aside`
  flex: 0 0 287px;
  border-right: 1px solid ${({ theme }) => theme.color.gallery};
`;

const MiddleColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 431px;
  background: ${({ theme }) => theme.color.lightBlue};
  border-right: 1px solid ${({ theme }) => theme.color.gallery};
`;

const RightColumnWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  max-width: calc(100% - 287px - 431px);
`;

const DashboardComponent = ({ notification }) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState(DASHBOARD_MODE.DEFAULT);
  const [
    startCtrlShiftSelectionItemId,
    setStartCtrlShiftSelectionItemId,
  ] = useState(null);
  const [searchedText, setSearchedText] = useState('');
  const [openedModal, setOpenedModal] = useState(null);
  const isLoading = useSelector(isLoadingSelector);
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);

  const handleOpenModal = modal => () => {
    setOpenedModal(modal);
  };

  const handleCloseModal = () => {
    setOpenedModal(null);
  };

  const handleCtrlSelectionItemBehaviour = itemId => {console.log(itemId);
    const ids = workInProgressItemIds.includes(itemId)
      ? workInProgressItemIds.filter(id => id !== itemId)
      : [...workInProgressItemIds, itemId];

    dispatch(setWorkInProgressItem(null));
    dispatch(setWorkInProgressItemIds(ids));
  };

  useEffectOnce(() => {
    dispatch(fetchUserSelfRequest());
    dispatch(fetchUserTeamsRequest());
    dispatch(initWorkflow());
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <DashboardLayout
        searchedText={searchedText}
        setSearchedText={setSearchedText}
        setMode={setMode}
      >
        <CenterWrapper>
          <Sidebar>
            <MenuList
              mode={mode}
              setSearchedText={setSearchedText}
              setMode={setMode}
            />
          </Sidebar>
          {mode === DASHBOARD_MODE.TOOL ? (
            <SecureMessage withScroll />
          ) : (
            <>
              <MiddleColumnWrapper>
                <MiddleColumn
                  mode={mode}
                  searchedText={searchedText}
                  handleOpenModal={handleOpenModal}
                  startCtrlShiftSelectionItemId={startCtrlShiftSelectionItemId}
                  setStartCtrlShiftSelectionItemId={
                    setStartCtrlShiftSelectionItemId
                  }
                  handleCtrlSelectionItemBehaviour={
                    handleCtrlSelectionItemBehaviour
                  }
                />
              </MiddleColumnWrapper>
              <RightColumnWrapper>
                <Item
                  notification={notification}
                  onClickShare={handleOpenModal(MODAL.SHARE)}
                  onClickMoveToTrash={handleOpenModal(MODAL.MOVE_TO_TRASH)}
                  onClickRemoveItem={handleOpenModal(MODAL.REMOVE_ITEM)}
                />
              </RightColumnWrapper>
            </>
          )}
        </CenterWrapper>
      </DashboardLayout>
      {openedModal === MODAL.SHARE && (
        <ShareModal
          notification={notification}
          handleCloseModal={handleCloseModal}
        />
      )}
      {openedModal === MODAL.MOVE_ITEM && (
        <MoveModal
          notification={notification}
          handleCloseModal={handleCloseModal}
          handleCtrlSelectionItemBehaviour={handleCtrlSelectionItemBehaviour}
        />
      )}
      <ConfirmMoveToTrashModal
        notification={notification}
        isOpened={openedModal === MODAL.MOVE_TO_TRASH}
        handleCloseModal={handleCloseModal}
      />
      <ConfirmRemoveItemModal
        isOpened={openedModal === MODAL.REMOVE_ITEM}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
};

// TODO: Replace with smth else?
// DashboardComponent.contextType = AbilityContext;

export const Dashboard = withNotification(DashboardComponent);
