import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useNavigatorOnline } from '@caesar/common/hooks';
import {
  ROUTES,
  ITEM_TYPE,
  ITEM_ICON_TYPE,
  CREATE_PERMISSION,
  ENTITY_TYPE,
} from '@caesar/common/constants';
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

export const AddItem = ({ workInProgressList, className }) => {
  const { push } = useRouter();

  const handleClickAddItem = (_, value) => {
    console.log('create item with type: ', value);
    push(ROUTES.CREATE);
  };

  const isOnline = useNavigatorOnline();

  const itemSubject = {
    __type: ENTITY_TYPE.ITEM,
    listType: workInProgressList?.type,
    teamId: workInProgressList?.teamId,
    userRole: workInProgressList?.userRole,
  };

  return (
    <Can I={CREATE_PERMISSION} of={itemSubject}>
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
            Add item
          </Button>
        )}
        className={className}
      />
    </Can>
  );
};
