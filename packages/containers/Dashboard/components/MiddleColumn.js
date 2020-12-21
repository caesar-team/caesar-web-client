import React, { memo, useRef, useEffect, useMemo } from 'react';
import { useClickAway } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import {
  DASHBOARD_MODE,
  LIST_TYPE,
  DECRYPTING_ITEM_NOTIFICATION,
  NOOP_NOTIFICATION,
  TEAM_TYPE,
  PERMISSION,
} from '@caesar/common/constants';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
  workInProgressListSelector,
} from '@caesar/common/selectors/workflow';
import {
  itemsByIdSelector,
  itemsByListIdSelector,
  teamItemsSelector,
} from '@caesar/common/selectors/entities/item';
import {
  trashListSelector,
  teamsTrashListsSelector,
} from '@caesar/common/selectors/entities/list';
import { teamMembersShortViewSelector } from '@caesar/common/selectors/entities/member';
import { currentTeamIdSelector } from '@caesar/common/selectors/currentUser';
import {
  setWorkInProgressItem,
  setWorkInProgressItemIds,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import { updateGlobalNotification } from '@caesar/common/actions/application';
import { MultiItem, List } from '@caesar/components';
import { sortByDate } from '@caesar/common/utils/dateUtils';
import { ability } from '@caesar/common/ability';
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
  const generalItems = useSelector(state =>
    itemsByListIdSelector(state, {
      teamId: workInProgressList?.teamId,
      listId: workInProgressList?.id,
    }),
  );

  const visibleListItems = useMemo(
    () =>
      generalItems.sort((a, b) =>
        sortByDate(a.lastUpdated, b.lastUpdated, 'DESC'),
      ),
    [generalItems],
  );
  const trashList = useSelector(trashListSelector);
  const teamsTrashLists = useSelector(teamsTrashListsSelector);
  const itemsById = useSelector(itemsByIdSelector);
  const currentTeamId = useSelector(currentTeamIdSelector);
  const teamMembers = useSelector(state =>
    teamMembersShortViewSelector(state, { teamId: currentTeamId }),
  );

  const itemsLengthInList = generalItems.length;
  const visibleListItemsLength = visibleListItems.length;

  const isPersonalTeam = currentTeamId === TEAM_TYPE.PERSONAL;
  const isMultiItem = workInProgressItemIds?.length > 0;
  const isInboxList = workInProgressList?.type === LIST_TYPE.INBOX;
  const isTrashList =
    workInProgressList?.id === trashList?.id ||
    teamsTrashLists?.map(({ id }) => id).includes(workInProgressList?.id);

  const currentTeamItems = useSelector(state =>
    teamItemsSelector(state, { teamId: currentTeamId }),
  );

  const searchedItems = useMemo(
    () =>
      filter(
        Object.values(currentTeamItems).sort((a, b) =>
          sortByDate(a.lastUpdated, b.lastUpdated, 'DESC'),
        ),
        searchedText,
      ),
    [currentTeamItems, searchedText],
  );

  const areAllItemsSelected =
    mode === DASHBOARD_MODE.SEARCH
      ? searchedItems.length === workInProgressItemIds.length
      : visibleListItemsLength === workInProgressItemIds.length;
  const ref = useRef(null);

  useEffect(() => {
    if (itemsLengthInList !== visibleListItemsLength) {
      dispatch(updateGlobalNotification(DECRYPTING_ITEM_NOTIFICATION, true));

      return;
    }

    dispatch(updateGlobalNotification(NOOP_NOTIFICATION, false));
  }, [itemsLengthInList, visibleListItemsLength]);

  useClickAway(ref, () => {
    if (isMultiItem && !hasOpenedModal) {
      dispatch(setWorkInProgressItemIds([]));
    }
  });
  
  const filterForbiddenItem = ({ _permissions }) =>
    ability.can(PERMISSION.MOVE, _permissions) && 
    ability.can(PERMISSION.SHARE, _permissions) && 
    ability.can(PERMISSION.TRASH, _permissions); 

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
            ? filter(Object.values(itemsById), searchedText)
              .filter(filterForbiddenItem)
              .map(({ id }) => id)
            : [],
        ),
      );
    } else {
      dispatch(
        setWorkInProgressItemIds(
          checked 
            ? visibleListItems
              .filter(filterForbiddenItem)
              .map(({ id }) => id) 
            : [],
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
          isPersonalTeam={isPersonalTeam}
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
