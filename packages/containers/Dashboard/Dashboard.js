import React, { useState, memo } from 'react';
import { useEffectOnce } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import { media } from '@caesar/assets/styles/media';
import { useMedia } from '@caesar/common/hooks';
import styled from 'styled-components';
import {
  isLoadingSelector,
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
} from '@caesar/common/selectors/workflow';
import {
  initDashboard,
  setWorkInProgressItem,
  setWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import {
  Item,
  MenuList,
  DashboardLayout,
  SecureMessage,
  FullScreenLoader,
} from '@caesar/components';
import { DASHBOARD_MODE } from '@caesar/common/constants';
import {
  MiddleColumn,
  MobileMenu,
  ShareModal,
  MoveModal,
  ConfirmMoveToTrashModal,
  ConfirmRemoveItemModal,
} from './components';
import { MODAL } from './constants';

const CenterWrapper = styled.div`
  display: grid;
  grid-template-columns: 287px 431px 1fr;
  width: 100%;
  min-height: calc(100vh - 55px);

  ${media.desktop`
    grid-template-columns: 20% 30% 1fr;
  `}

  ${media.tablet`
    grid-template-columns: 25% 25% 1fr;
  `}
  
  ${media.wideMobile`
    grid-template-columns: 40% 60%;
  `}
  
  ${media.mobile`
    grid-template-columns: 1fr;
  `}
`;

const Sidebar = styled.aside`
  border-right: 1px solid ${({ theme }) => theme.color.gallery};
`;

const MiddleColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.alto};
  border-right: 1px solid ${({ theme }) => theme.color.gallery};
`;

const RightColumnWrapper = styled.div`
  position: relative;
`;

const StyledSecureMessage = styled(SecureMessage)`
  max-width: 848px;
  padding-right: 24px;
  padding-left: 24px;
  margin: 0 auto;
`;

const DashboardComponent = () => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState(DASHBOARD_MODE.DEFAULT);
  const [searchedText, setSearchedText] = useState('');
  const [openedModal, setOpenedModal] = useState(null);
  const isLoading = useSelector(isLoadingSelector);
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const { isMobile, isWideMobile } = useMedia();
  const isItemViewActive = (isMobile && workInProgressItem) || !isMobile;
  const isMiddleColumnActive = (isMobile && !workInProgressItem) || !isMobile;

  const handleOpenModal = modal => () => {
    setOpenedModal(modal);
  };

  const handleCloseModal = () => {
    setOpenedModal(null);
  };

  const handleCtrlSelectionItemBehaviour = itemId => {
    const ids = workInProgressItemIds.includes(itemId)
      ? workInProgressItemIds.filter(id => id !== itemId)
      : [...workInProgressItemIds, itemId];

    if (workInProgressItem) {
      dispatch(setWorkInProgressItem(null));
    }

    dispatch(setWorkInProgressItemIds(ids));
  };

  useEffectOnce(() => {
    dispatch(initDashboard());
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
        {(isMobile || isWideMobile) && (
          <MobileMenu
            mode={mode}
            setSearchedText={setSearchedText}
            setMode={setMode}
            isFullWidth={isMobile}
          />
        )}        
        <CenterWrapper>
          {(!isWideMobile && !isMobile) && (
            <Sidebar>
              <MenuList
                mode={mode}
                setSearchedText={setSearchedText}
                setMode={setMode}
              />
            </Sidebar>
          )}
          {mode === DASHBOARD_MODE.TOOL ? (
            <StyledSecureMessage withScroll />
          ) : (
            <>
              {isMiddleColumnActive && (
                <MiddleColumnWrapper>
                  <MiddleColumn
                    mode={mode}
                    searchedText={searchedText}
                    hasOpenedModal={openedModal}
                    handleOpenModal={handleOpenModal}
                    handleCtrlSelectionItemBehaviour={
                      handleCtrlSelectionItemBehaviour
                    }
                  />
                </MiddleColumnWrapper>
              )}
              {isItemViewActive && (
                <RightColumnWrapper>
                  <Item
                    onClickShare={handleOpenModal(MODAL.SHARE)}
                    onClickMoveToTrash={handleOpenModal(MODAL.MOVE_TO_TRASH)}
                    onClickRemoveItem={handleOpenModal(MODAL.REMOVE_ITEM)}
                  />
                </RightColumnWrapper>
              )}
            </>
          )}
        </CenterWrapper>
      </DashboardLayout>
      {openedModal === MODAL.SHARE && (
        <ShareModal
          handleCloseModal={handleCloseModal}
          handleCtrlSelectionItemBehaviour={handleCtrlSelectionItemBehaviour}
        />
      )}
      {openedModal === MODAL.MOVE_ITEM && (
        <MoveModal
          handleCloseModal={handleCloseModal}
          handleCtrlSelectionItemBehaviour={handleCtrlSelectionItemBehaviour}
        />
      )}
      {openedModal === MODAL.MOVE_TO_TRASH && (
        <ConfirmMoveToTrashModal isOpened handleCloseModal={handleCloseModal} />
      )}
      {openedModal === MODAL.REMOVE_ITEM && (
        <ConfirmRemoveItemModal isOpened handleCloseModal={handleCloseModal} />
      )}
    </>
  );
};

export const Dashboard = memo(DashboardComponent);
