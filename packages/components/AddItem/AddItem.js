import React from 'react';
import styled from 'styled-components';
import { useNavigatorOnline } from '@caesar/common/hooks';
import {
  ITEM_TYPES,
  ITEM_ICON_TYPES,
  CREATE_PERMISSION,
  ITEM_ENTITY_TYPE,
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

const { ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE } = ITEM_TYPES;

const itemTypesOptions = [
  { label: 'Password', value: ITEM_CREDENTIALS_TYPE },
  { label: 'Secure note', value: ITEM_DOCUMENT_TYPE },
];

const renderAddItemOptions = (value, label) => (
  <AddItemOption key={value}>
    <PlusIcon name={ITEM_ICON_TYPES[value]} width={16} height={16} />
    {label}
  </AddItemOption>
);

export const AddItem = ({
  workInProgressList,
  onClickCreateItem,
  className,
}) => {
  const isOnline = useNavigatorOnline();

  const itemSubject = {
    __type: ITEM_ENTITY_TYPE,
    listType: workInProgressList?.type,
    teamId: workInProgressList?.teamId,
    userRole: workInProgressList?.userRole,
  };

  return (
    <Can I={CREATE_PERMISSION} of={itemSubject}>
      <Dropdown
        options={itemTypesOptions}
        onClick={onClickCreateItem}
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
