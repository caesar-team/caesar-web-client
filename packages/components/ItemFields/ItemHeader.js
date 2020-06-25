import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setWorkInProgressItem } from '@caesar/common/actions/workflow';
import { toggleItemToFavoriteRequest } from '@caesar/common/actions/entities/item';
import { Button } from '../Button';

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 8px 24px;
  background-color: ${({ theme }) => theme.color.alto};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
`;

const PathButton = styled(Button)`
  margin-right: auto;
  font-size: ${({ theme }) => theme.font.size.main};
  text-transform: initial;
`;

const Delimeter = styled.span`
  margin: 0 16px;
`;

const ActionButton = styled(Button)`
  margin-left: 16px;
`;

export const ItemHeader = ({ item }) => {
  const dispatch = useDispatch();
  const { id, favorite } = item;

  const handleToggleFavorites = () => {
    dispatch(toggleItemToFavoriteRequest(id));
  };

  const handleClickCloseItem = () => {
    dispatch(setWorkInProgressItem(null));
  };

  return (
    <ColumnHeader>
      <PathButton
        color="white"
        onClick={() => {
          console.log('Change path');
        }}
      >
        Personal
        <Delimeter>|</Delimeter>
        Passwords
      </PathButton>
      <ActionButton
        icon="share"
        color="white"
        onClick={() => {
          console.log('Share');
        }}
      />
      <ActionButton
        icon={favorite ? 'favorite-active' : 'favorite'}
        color="white"
        onClick={handleToggleFavorites}
      />
      <ActionButton icon="close" color="white" onClick={handleClickCloseItem} />
    </ColumnHeader>
  );
};
