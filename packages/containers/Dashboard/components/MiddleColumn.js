import React, { memo, useRef } from 'react';
import { useClickAway } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import { DASHBOARD_MODE, LIST_TYPE, TEAM_TYPE } from '@caesar/common/constants';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressListSelector,
  visibleListItemsSelector,
} from '@caesar/common/selectors/workflow';
import { itemsByIdSelector } from '@caesar/common/selectors/entities/item';
import {
  trashListSelector,
  teamsTrashListsSelector,
} from '@caesar/common/selectors/entities/list';
import { teamMembersSelector } from '@caesar/common/selectors/entities/team';
import { currentTeamIdSelector } from '@caesar/common/selectors/user';
import {
  setWorkInProgressItem,
  setWorkInProgressItemIds,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import { MultiItem, List } from '@caesar/components';
import { MODAL } from '../constants';
import { filter } from '../utils';

const MiddleColumnComponent = ({
  mode,
  searchedText,
  hasOpenedModal = false,
  handleOpenModal,
  handleCtrlSelectionItemBehaviour,
}) => {
  const dispatch = useDispatch();
  const workInProgressItemIds = useSelector(workInProgressItemIdsSelector);
  const workInProgressList = useSelector(workInProgressListSelector);
  const workInProgressItem = useSelector(workInProgressItemSelector);
  const visibleListItems = useSelector(visibleListItemsSelector);
  const trashList = useSelector(trashListSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);
  const itemsById = useSelector(itemsByIdSelector);
  const currentTeamId = useSelector(currentTeamIdSelector);
  const teamMembers = useSelector(state => teamMembersSelector(state, { teamId: currentTeamId }));

  const isPersonalTeam = currentTeamId === TEAM_TYPE.PERSONAL;
  const isMultiItem = workInProgressItemIds?.length > 0;
  const isInboxList = workInProgressList?.type === LIST_TYPE.INBOX;
  const isTrashList =
    workInProgressList?.id === trashList?.id ||
    teamsTrashLists?.map(({ id }) => id).includes(workInProgressList?.id);

  const searchedItems = filter(Object.values(itemsById), searchedText);

  const areAllItemsSelected =
    mode === DASHBOARD_MODE.SEARCH
      ? searchedItems.length === workInProgressItemIds.length
      : visibleListItems.length === workInProgressItemIds.length;
  const ref = useRef(null);

  useClickAway(ref, () => {
    if (isMultiItem && !hasOpenedModal) {
      dispatch(setWorkInProgressItemIds([]));
    }
  });

  const handleDefaultSelectionItemBehaviour = itemId => {
    dispatch(resetWorkInProgressItemIds());
    dispatch(setWorkInProgressItem(itemsById[itemId]));
  };

  const handleClickItem = itemId => () => {
    handleDefaultSelectionItemBehaviour(itemId);
  };

  const handleSelectAllListItems = event => {
    const { checked } = event.currentTarget;

    if (mode === DASHBOARD_MODE.SEARCH) {
      dispatch(
        setWorkInProgressItemIds(
          checked
            ? filter(Object.values(itemsById), searchedText).map(({ id }) => id)
            : [],
        ),
      );
    } else {
      dispatch(
        setWorkInProgressItemIds(
          checked ? visibleListItems.map(({ id }) => id) : [],
        ),
      );
    }
  };

  return (
    <div ref={ref}>
      {isMultiItem && (
        <MultiItem
          isInboxItems={isInboxList}
          isTrashItems={isTrashList}
          workInProgressItemIds={workInProgressItemIds}
          areAllItemsSelected={areAllItemsSelected}
          onClickMove={handleOpenModal(MODAL.MOVE_ITEM)}
          onClickMoveToTrash={handleOpenModal(MODAL.MOVE_TO_TRASH)}
          onClickRemove={handleOpenModal(MODAL.REMOVE_ITEM)}
          onClickShare={handleOpenModal(MODAL.SHARE)}
          onSelectAll={handleSelectAllListItems}
        />
      )}
      <List
        mode={mode}
        isMultiItem={isMultiItem}
        workInProgressList={workInProgressList}
        workInProgressItem={workInProgressItem}
        workInProgressItemIds={workInProgressItemIds}
        items={
          mode === DASHBOARD_MODE.DEFAULT ? visibleListItems : searchedItems
        }
        teamMembersCount={isPersonalTeam ? 1 : teamMembers.length}
        onClickItem={handleClickItem}
        onSelectItem={handleCtrlSelectionItemBehaviour}
      />
    </div>
  );
};

export const MiddleColumn = memo(MiddleColumnComponent);
