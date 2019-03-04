import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Button } from 'components/Button';
import { AvatarsList } from 'components/Avatar';
import Link from 'next/link';
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

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

const TableName = styled.div`
  font-size: 36px;
  color: ${({ theme }) => theme.black};
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
  fill: #888b90;
`;

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

  render() {
    const { hoverRowIndex } = this.state;
    const {
      list,
      members,
      onClickCreateList = Function.prototype,
      onClickRemoveList = Function.prototype,
    } = this.props;
    const generateAvatars = invitedIds =>
      invitedIds.map(item => members[item.id]);

    console.log(list);
    console.log(members);
    return (
      <Fragment>
        <Header>
          <TableName>Lists</TableName>
          <Button onClick={onClickCreateList} icon="plus" color="black">
            ADD LIST
          </Button>
        </Header>
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
          {list.map((listItem, index) => (
            <TableRow key={listItem.id}>
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
                    onClickRemoveList={onClickRemoveList}
                  />
                </MembersCol>
              </TableCol>
            </TableRow>
          ))}
        </Table>
      </Fragment>
    );
  }
}

export default ManageList;
