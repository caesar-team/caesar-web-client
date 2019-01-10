import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Table } from 'antd';
import Link from 'next/link';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: calc(100vh - 140px);
`;

const TableName = styled.div`
  font-size: 24px;
  line-height: 30px;
  color: #2e2f31;
  margin-bottom: 20px;
`;

const StyledTable = styled(Table)`
  .ant-table-thead,
  .ant-table-tbody {
    font-size: 18px;
    color: #2e2f31;
  }

  .ant-table-tbody > tr {
    height: 60px;
  }

  .ant-table-tbody > tr > td {
    padding: 9px 16px 10px;
  }

  .ant-table-placeholder {
    font-size: 18px;
    color: #2e2f31;
  }
`;

const ListName = styled.div`
  display: flex;
  align-items: center;
`;

const ListNameLink = styled.a`
  color: #3d70ff;
  margin-right: 10px;
`;

const MembersColumn = styled.div`
  display: flex;
  align-items: center;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;

  > svg {
    fill: #888b90;
  }
`;

const EmptyBlock = styled.div`
  width: 100px;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 30px;
  left: 0;
`;

const StyledButton = styled(Button)`
  width: 60px;
  height: 60px;

  > .anticon {
    margin-top: 4px;

    > svg {
      width: 20px;
      height: 20px;
    }
  }
`;

class ManageList extends Component {
  state = {
    hoverRowIndex: null,
  };

  handleMouseEnter = index => () => {
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
      onClickCreateList = Function.prototype,
      onClickEditList = Function.prototype,
      onClickRemoveList = Function.prototype,
    } = this.props;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'label',
        width: '30%',
        render: (text, data, index) => (
          <ListName
            onMouseEnter={this.handleMouseEnter(index)}
            onMouseLeave={this.handleMouseLeave}
          >
            <Link href={{ pathname: '/', query: { listId: data.id } }}>
              <ListNameLink>{text}</ListNameLink>
            </Link>
            {index === hoverRowIndex && (
              <StyledIcon type="edit" onClick={onClickEditList(data.id)} />
            )}
          </ListName>
        ),
      },
      {
        title: 'Elements',
        dataIndex: 'count',
        width: '30%',
        key: 'count',
      },
      {
        title: 'Members',
        dataIndex: 'shared',
        render(_, data, key) {
          return (
            <MembersColumn key={key}>
              <EmptyBlock />
              <StyledIcon
                type="delete"
                fill="#888b90"
                onClick={onClickRemoveList(data.id)}
              />
            </MembersColumn>
          );
        },
      },
    ];

    return (
      <Wrapper>
        <TableName>Lists</TableName>
        <StyledTable dataSource={list} columns={columns} rowKey="id" />
        <ButtonWrapper>
          <StyledButton
            type="primary"
            shape="circle"
            onClick={onClickCreateList}
          />
        </ButtonWrapper>
      </Wrapper>
    );
  }
}

export default ManageList;
