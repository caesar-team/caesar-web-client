import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigatorOnline } from '@caesar/common/hooks';
import {
  ROUTES,
  ITEM_TYPE,
  ITEM_ICON_TYPE,
  PERMISSION,
  PERMISSION_ENTITY,
  TEAM_TYPE,
} from '@caesar/common/constants';
import { workInProgressListSelector } from '@caesar/common/selectors/workflow';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Dropdown } from '../Dropdown';
import { Can } from '../Ability';

const PlusIcon = styled(Icon)`
  margin-right: 15px;
`;

const AddItemOption = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 16px;
  padding: 10px 30px;
  border: none;
  background: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
  }
`;

const { CREDENTIALS, DOCUMENT } = ITEM_TYPE;

const itemTypesOptions = [
  { label: 'Password', value: CREDENTIALS },
  { label: 'Secure note', value: DOCUMENT },
];

const renderAddItemOptions = (value, label) => (
  <AddItemOption key={value}>
    <PlusIcon name={ITEM_ICON_TYPE[value]} width={16} height={16} />
    {label}
  </AddItemOption>
);

export const AddItem = ({ className }) => {
  const { push } = useRouter();
  const currentTeam = useSelector(currentTeamSelector);
  const workInProgressList = useSelector(workInProgressListSelector);

  const handleClickAddItem = (_, value) => {
    push(
      `${ROUTES.CREATE}?type=${value}${
        currentTeam ? `&teamId=${currentTeam?.id}` : ''
      }&listId=${workInProgressList?.id}`,
    );
  };

  const isOnline = useNavigatorOnline();

  // Todo: The Can should get an entity itself
  const itemSubject =
    currentTeam?.id === TEAM_TYPE.PERSONAL
      ? {
          __typename: PERMISSION_ENTITY.ITEM,
          // eslint-disable-next-line camelcase
          create_item: workInProgressList?._permissions?.create_item || false,
        }
      : {
          __typename: PERMISSION_ENTITY.TEAM_ITEM,
          // eslint-disable-next-line camelcase
          team_create_item:
            // eslint-disable-next-line camelcase
            workInProgressList?._permissions?.team_create_item || false,
        };

  return (
    <Can I={PERMISSION.CREATE} an={itemSubject}>
      <Dropdown
        options={itemTypesOptions}
        onClick={handleClickAddItem}
        optionRender={renderAddItemOptions}
        withTriangleAtTop
        ButtonElement={({ handleToggle }) => (
          <Button
            withOfflineCheck
            isOnline={isOnline}
            icon="plus"
            onClick={handleToggle}
          >
            Add an item
          </Button>
        )}
        className={className}
      />
    </Can>
  );
};
