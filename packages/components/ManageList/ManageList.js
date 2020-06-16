import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Link from 'next/link';
import { LIST_TYPE, ROUTES } from '@caesar/common/constants';
import { Button } from '../Button';
import DottedMenu from '../DottedMenu/DottedMenu';
import AvatarsList from '../Avatar/AvatarsList';
import withOfflineDetection from '../Offline/withOfflineDetection';

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
  color: ${({ theme }) => theme.color.black};
  background-color: ${({ theme }) => theme.color.white};
`;

const TableHeader = styled(TableRow)`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.color.gray};
  background-color: ${({ theme }) => theme.color.lightBlue};
  border-bottom: 1px solid ${({ theme }) => theme.color.gray};
`;

const TableCol = styled.div`
  display: flex;
  width: ${({ width }) => width || '100%'};
  padding: 10px 15px;

  ${getTableColAlignStyles};
`;

const ListNameLink = styled.a`
  display: inline-block;
  color: ${({ theme }) => theme.color.black};
  margin-right: 10px;
  border-bottom: 1px dashed transparent;
`;

const MembersCol = styled.div`
  display: flex;
  align-items: center;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 50px;
`;

const ListWrapper = styled.div``;

class ManageList extends Component {
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
    const {
      isOnline,
      lists,
      members,
      onClickEditList = Function.prototype,
      onClickRemoveList = Function.prototype,
    } = this.props;

    const generateAvatars = invites => {
      const invitedUserIds = [...new Set(invites.map(invite => invite.userId))];

      return invitedUserIds.reduce(
        (accumulator, userId) =>
          members[userId] ? [...accumulator, members[userId]] : accumulator,
        [],
      );
    };

    const filteredList = lists.filter(
      ({ label }) => label !== LIST_TYPE.DEFAULT,
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
              <Link
                href={{
                  pathname: ROUTES.DASHBOARD,
                  query: { listId: listItem.id },
                }}
              >
                <ListNameLink>{listItem.label}</ListNameLink>
              </Link>
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
                {isOnline && (
                  <DottedMenu
                    tooltipProps={{
                      textBoxWidth: '100px',
                      arrowAlign: 'start',
                      position: 'bottom center',
                    }}
                  >
                    <StyledButton
                      color="white"
                      onClick={onClickEditList(listItem.id)}
                    >
                      Edit
                    </StyledButton>
                    <StyledButton
                      color="white"
                      onClick={onClickRemoveList(listItem.id)}
                    >
                      Remove
                    </StyledButton>
                  </DottedMenu>
                )}
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
      <Fragment>
        <Table>
          <TableHeader>
            <TableCol align="left" width="33.33333%">
              Name
            </TableCol>
            <TableCol align="center" width="33.33333%">
              Elements
            </TableCol>
            <TableCol align="right" width="33.33333%" />
          </TableHeader>
        </Table>
        {this.renderItems()}
      </Fragment>
    );
  }
}

export default withOfflineDetection(ManageList);
