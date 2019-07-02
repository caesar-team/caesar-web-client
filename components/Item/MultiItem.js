import React from 'react';
import styled from 'styled-components';
import { Button, Dropdown } from 'components';
import { Checkbox } from '../Checkbox';
import { TRASH_TYPE } from '../../common/constants';
import { upperFirst } from '../../common/utils/string';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.black};
  color: ${({ theme }) => theme.white};
  position: relative;
  height: 61px;
  padding: 0 20px;
`;

const LeftTopWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const RightTopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonStyled = styled(Button)`
  margin: 0 10px;
`;

const MoveTo = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 14px;
  letter-spacing: 0.4px;
  border-radius: 3px;
  border: 0;
  outline: none;
  cursor: pointer;
  padding: 10px 20px;
  transition: all 0.2s;
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.emperor};
  border: 1px solid ${({ theme }) => theme.gallery};

  &:hover {
    color: ${({ theme }) => theme.black};
    background-color: ${({ theme }) => theme.white};
    border: 1px solid ${({ theme }) => theme.black};
  }
`;

const StyledDropdown = styled(Dropdown)`
  width: 100%;
  margin-right: 10px;
`;

const CheckboxStyled = styled(Checkbox)`
  margin-right: 20px;

  ${Checkbox.Box} {
    background-color: ${({ theme }) => theme.emperor};
    border: 1px solid ${({ theme }) => theme.emperor};

    ${({ checked }) => `

      > svg {
        display: ${checked ? 'block' : 'none'};
      }
    `}
  }
`;

const MultiItem = ({
  isTrashItems = false,
  areAllItemsSelected = false,
  workInProgressItemIds,
  allLists = [],
  onClickMove = Function.prototype,
  onClickRemove = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onClickShare = Function.prototype,
  onSelectAll = Function.prototype,
}) => {
  if (!workInProgressItemIds) {
    return null;
  }

  const options = allLists
    .filter(({ type }) => type !== TRASH_TYPE)
    .map(({ label, id }) => ({ value: id, label: upperFirst(label) }));

  return (
    <Wrapper>
      <LeftTopWrapper>
        <CheckboxStyled checked={areAllItemsSelected} onChange={onSelectAll} />
        {workInProgressItemIds.length} items
      </LeftTopWrapper>
      <RightTopWrapper>
        <StyledDropdown options={options} onClick={onClickMove}>
          <MoveTo>MOVE</MoveTo>
        </StyledDropdown>
        <ButtonStyled
          onlyIcon
          color="white"
          icon="share"
          onClick={onClickShare}
        />
        <Button
          onlyIcon
          color="white"
          icon="trash"
          onClick={isTrashItems ? onClickRemove : onClickMoveToTrash}
        />
      </RightTopWrapper>
    </Wrapper>
  );
};

export default MultiItem;
