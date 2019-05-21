import React, { Component } from 'react';
import styled from 'styled-components';
import ListOption from './ListOption';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 0 16px;
`;

const ListsName = styled.div`
  margin-top: 12px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

class Lists extends Component {
  renderLists() {
    const {
      lists,
      workInProgressList,
      workInProgressItem,
      visibleListItems,
      onClickList,
      onClickItem,
    } = this.props;

    return lists.map(list => {
      const isActive = workInProgressList && list.id === workInProgressList.id;

      return (
        <ListOption
          list={list}
          items={visibleListItems}
          workInProgressItem={workInProgressItem}
          isActive={isActive}
          onClickList={onClickList}
          onClickItem={onClickItem}
        />
      );
    });
  }

  render() {
    const renderedList = this.renderLists();

    return (
      <Wrapper>
        <ListsName>Lists</ListsName>
        {renderedList}
      </Wrapper>
    );
  }
}

export default Lists;
