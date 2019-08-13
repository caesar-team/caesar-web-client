import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AvatarsList } from 'components/Avatar';
import Link from 'next/link';
import { DEFAULT_LIST_TYPE } from 'common/constants';
import { Icon } from '../Icon';
import { ListOptions } from './ListOptions';

const getTableColAlignStyles = ({ align }) => {
  switch (align) {
    case 'left':
      return 'justify-content: flex-start';
    case 'center':
      return 'justify-content: center';
    case 'right':
      return 'justify-content: flex-end';
    default:
      return 'justify-content: flex-start';
  }
};

const Table = styled.div`
  padding-top: 20px;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 18px;
  line-height: 1.3;
  color: ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.white};
`;

const TableHeader = styled(TableRow)`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.gray};
  background-color: ${({ theme }) => theme.lightBlue};
  border-bottom: 1px solid ${({ theme }) => theme.gray};
`;

const TableCol = styled.div`
  display: flex;
  width: ${({ width }) => width || '100%'};
  padding: 10px 15px;

  ${getTableColAlignStyles};
`;

const ListNameLink = styled.a`
  display: inline-block;
  color: ${({ theme }) => theme.black};
  margin-right: 10px;
  border-bottom: 1px dashed transparent;
`;

const ListName = styled.div`
  display: flex;
  align-items: center;

  &:hover {
    ${ListNameLink} {
      color: ${({ theme }) => theme.black};
      border-color: ${({ theme }) => theme.black};
    }
  }
`;

const MembersCol = styled.div`
  display: flex;
  align-items: center;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  fill: ${({ theme }) => theme.gray};
`;

const ListWrapper = styled.div``;

class ManageList extends Component {
  state = {
    hoverRowIndex: null,
  };

  handleMouseEnter = index => {
    this.setState({
      hoverRowIndex: index,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      hoverRowIndex: null,
    });
  };

  handleDragEnd = ({ draggableId, source, destination }) => {
    const { onChangeSort = Function.prototype } = this.props;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onChangeSort(draggableId, source.index, destination.index);
  };

  renderItems() {
    const { hoverRowIndex } = this.state;
    const {
      lists,
      members,
      onClickEditList = Function.prototype,
      onClickRemoveList = Function.prototype,
    } = this.props;

    const generateAvatars = invites => {
      const invitedUserIds = [...new Set(invites.map(invite => invite.userId))];

      return invitedUserIds.map(userId => members[userId]);
    };

    const filteredList = lists.filter(
      ({ label }) => label !== DEFAULT_LIST_TYPE,
    );

    const renderedItems = filteredList.map((listItem, index) => (
      <Draggable key={listItem.id} draggableId={listItem.id} index={index}>
        {provided => (
          <TableRow
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TableCol align="left" width="33.33333%">
              <ListName
                onMouseEnter={() => this.handleMouseEnter(index)}
                onMouseLeave={this.handleMouseLeave}
              >
                <Link
                  href={{
                    pathname: '/',
                    query: { listId: listItem.id },
                  }}
                >
                  <ListNameLink>{listItem.label}</ListNameLink>
                </Link>
                {index === hoverRowIndex && (
                  <StyledIcon name="edit" width="14" height="14" />
                )}
              </ListName>
            </TableCol>
            <TableCol align="center" width="33.33333%">
              {listItem.count}
            </TableCol>
            <TableCol align="right" width="33.33333%">
              <MembersCol>
                <AvatarsList
                  isSmall
                  visibleCount="4"
                  avatars={generateAvatars(listItem.invited)}
                />
                <ListOptions
                  index={index}
                  listId={listItem.id}
                  onClickEditList={onClickEditList}
                  onClickRemoveList={onClickRemoveList}
                />
              </MembersCol>
            </TableCol>
          </TableRow>
        )}
      </Draggable>
    ));

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <Droppable droppableId="droppable" type="lists" key={lists.length}>
          {listProvided => (
            <ListWrapper
              ref={listProvided.innerRef}
              {...listProvided.droppableProps}
            >
              {renderedItems}
              {listProvided.placeholder}
            </ListWrapper>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  render() {
    return (
      <>
        <Table>
          <TableHeader>
            <TableCol align="left" width="33.33333%">
              Name
            </TableCol>
            <TableCol align="center" width="33.33333%">
              Elements
            </TableCol>
            <TableCol align="right" width="33.33333%">
              Members
            </TableCol>
          </TableHeader>
        </Table>
        {this.renderItems()}
      </>
    );
  }
}

export default ManageList;
