import React from 'react';
import styled from 'styled-components';
import { FAVORITES_TYPE, ITEM_TYPES, TRASH_TYPE } from 'common/constants';
import { Icon, Scrollbar } from 'components';
import Item from './Item';
import EmptyList from './EmptyList';
import { Dropdown } from '../Dropdown';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  background-color: ${({ isEmpty, theme }) =>
    isEmpty ? theme.white : theme.lightBlue};
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  height: 61px;
  padding: 10px 30px;
  background-color: ${({ theme }) => theme.white};
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  text-transform: capitalize;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
`;

const CreateButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  color: ${({ theme }) => theme.emperor};
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.gallery};

  &:hover {
    color: ${({ theme }) => theme.white};
    background-color: ${({ theme }) => theme.black};
    border: 1px solid ${({ theme }) => theme.black};
  }
`;

const StyledIcon = styled(Icon)`
  margin-right: 15px;
`;

const Option = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 16px;
  letter-spacing: 0.5px;
  padding: 10px 30px;
  border: none;
  background: none;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.snow};
  }
`;

const { ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE } = ITEM_TYPES;

const iconsMap = {
  [ITEM_CREDENTIALS_TYPE]: 'key',
  [ITEM_DOCUMENT_TYPE]: 'securenote',
};

const renderOption = (value, label) => (
  <Option key={value}>
    <StyledIcon name={iconsMap[value]} width={16} height={16} />
    {label}
  </Option>
);

const List = ({
  title = '',
  activeItemId = null,
  list,
  onClickItem = Function.prototype,
  onClickCreateItem = Function.prototype,
}) => {
  const renderedItems = list.children.map(({ id, ...props }) => {
    const isActive = id === activeItemId;

    return (
      <Item
        key={id}
        id={id}
        isActive={isActive}
        onClickItem={onClickItem}
        {...props}
      />
    );
  });

  const itemTypesOptions = [
    { label: 'Password', value: ITEM_CREDENTIALS_TYPE },
    { label: 'Secure note', value: ITEM_DOCUMENT_TYPE },
  ];

  const isEmpty = list.children.length === 0;
  const renderedList = () => {
    if (isEmpty) {
      return <EmptyList />;
    }

    return <Scrollbar>{renderedItems}</Scrollbar>;
  };

  const isFavorite = list.type === FAVORITES_TYPE;
  const isTrash = list.type === TRASH_TYPE;
  const shouldShowAdd = !isFavorite && !isTrash;

  return (
    <Wrapper isEmpty={isEmpty}>
      <TitleWrapper>
        <Title>{title}</Title>
        {shouldShowAdd && (
          <Dropdown
            options={itemTypesOptions}
            onClick={onClickCreateItem}
            optionRender={renderOption}
          >
            <CreateButton>
              <Icon name="plus" width={14} height={14} isInButton />
            </CreateButton>
          </Dropdown>
        )}
      </TitleWrapper>
      {renderedList()}
    </Wrapper>
  );
};

export default List;
