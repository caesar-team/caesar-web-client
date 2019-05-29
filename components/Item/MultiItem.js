import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Button, Dropdown } from 'components';
import EmptyItem from './EmptyItem';
import { TRASH_TYPE } from '../../common/constants';
import { upperFirst } from '../../common/utils/string';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 60px 0;
  height: calc(100vh - 70px);
`;

const TopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.black};
  color: ${({ theme }) => theme.white};
  position: relative;
  height: 60px;
  padding: 0 20px;
`;

const LeftTopWrapper = styled.div`
  display: flex;
  align-items: center;
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
`;

const MultiItem = ({
  isTrashItems = false,
  workInProgressItemIds,
  allLists = [],
  onClickMove = Function.prototype,
  onClickRemove = Function.prototype,
  onClickMoveToTrash = Function.prototype,
  onClickShare = Function.prototype,
}) => {
  if (!workInProgressItemIds) {
    return null;
  }

  const options = allLists
    .filter(({ type }) => type !== TRASH_TYPE)
    .map(({ label, id }) => ({ value: id, label: upperFirst(label) }));

  return (
    <Fragment>
      <TopWrapper>
        <LeftTopWrapper>
          {workInProgressItemIds.length} items selected
        </LeftTopWrapper>
        <RightTopWrapper>
          <StyledDropdown options={options} onClick={onClickMove}>
            <MoveTo>Move to</MoveTo>
          </StyledDropdown>
          <ButtonStyled
            color="white"
            onClick={isTrashItems ? onClickRemove : onClickMoveToTrash}
          >
            Remove
          </ButtonStyled>
          <Button color="white" icon="share" onClick={onClickShare}>
            Share
          </Button>
        </RightTopWrapper>
      </TopWrapper>
      <Wrapper>
        <EmptyItem />
      </Wrapper>
    </Fragment>
  );
};

export default MultiItem;
