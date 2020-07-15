import React from 'react';
import styled from 'styled-components';
import { Button } from '@caesar/components';
import { Checkbox } from '../Checkbox';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 4px 24px;
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.black};
`;

const Title = styled.div`
  margin-right: auto;
  margin-left: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const ButtonStyled = styled(Button)`
  margin-left: 8px;
`;

const CheckboxStyled = styled(Checkbox)`
  margin: 0 8px;

  ${Checkbox.Box} {
    background-color: ${({ theme }) => theme.color.emperor};
    border-color: ${({ theme }) => theme.color.emperor};

    ${({ checked }) => `
      > svg {
        display: ${checked ? 'block' : 'none'};
      }
    `}
  }

  ${Checkbox.Input}:checked + ${Checkbox.Box} {
    background-color: ${({ theme }) => theme.color.emperor};
    border-color: ${({ theme }) => theme.color.emperor};
  }
`;

export const MultiItem = ({
  isInboxItems = false,
  isTrashItems = false,
  areAllItemsSelected = false,
  workInProgressItemIds,
  onClickMove = Function.prototype,
  onClickRemove = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onClickShare = Function.prototype,
  onSelectAll = Function.prototype,
}) => {
  if (!workInProgressItemIds) {
    return null;
  }

  return (
    <Wrapper>
      <CheckboxStyled checked={areAllItemsSelected} onChange={onSelectAll} />
      <Title>{workInProgressItemIds.length} items</Title>
      <ButtonStyled withOfflineCheck color="white" onClick={onClickMove}>
        MOVE
      </ButtonStyled>
      {!isInboxItems && (
        <ButtonStyled
          withOfflineCheck
          color="white"
          icon="share"
          onClick={onClickShare}
        />
      )}
      <ButtonStyled
        withOfflineCheck
        color="white"
        icon="trash"
        onClick={isTrashItems ? onClickRemove : onClickMoveToTrash}
      />
    </Wrapper>
  );
};
