import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Head,
  AuthTitle,
  AuthDescription,
  Checkbox,
  Button,
  Scrollbar,
} from 'components';
import { getSharedItems } from 'common/api';

const Wrapper = styled.div``;

const ScrollbarStyled = styled(Scrollbar)`
  min-height: 300px;
  height: 100%;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};

  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.div`
  font-size: 16px;
  margin-left: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;

const DATA = [
  { id: 1, secret: 'asdasdasdasdasd' },
  { id: 2, secret: 'zxczxczxczxczxc' },
  { id: 3, secret: 'dfgdfgdfgdfgdfgdfg' },
  { id: 4, secret: '234234234234234234' },
  { id: 5, secret: 'berberberberberb' },
  { id: 6, secret: 'berberberberberb' },
  { id: 7, secret: 'berberberberberb' },
  { id: 8, secret: 'berberberberberb' },
  { id: 9, secret: 'berberberberberb' },
  { id: 10, secret: 'berberberberberb' },
  { id: 11, secret: 'berberberberberb' },
  { id: 12, secret: 'berberberberberb' },
  { id: 13, secret: 'berberberberberb' },
  { id: 14, secret: 'berberberberberb' },
  { id: 15, secret: 'berberberberberb' },
  { id: 16, secret: 'berberberberberb' },
];

class SharedItemsStep extends Component {
  state = this.prepareInitialState();

  items = null;

  async componentDidMount() {
    try {
      // const { data } = await getSharedItems();

      this.setState({
        items: DATA,
        selectedIds: DATA.map(({ id }) => id),
      });
    } catch (e) {
      console.log(e.response.data);
    }
  }

  handleSelectRow = itemId => () => {
    this.setState(prevState => ({
      selectedIds: prevState.selectedIds.includes(itemId)
        ? prevState.selectedIds.filter(id => id !== itemId)
        : [...prevState.selectedIds, itemId],
    }));
  };

  handleAccept = () => {
    const { onFinish = Function.prototype } = this.props;

    // TODO: take selected rows and encrypt via new keys

    onFinish();
  };

  handleReject = () => {
    const { onFinish = Function.prototype } = this.props;

    onFinish();
  };

  prepareInitialState() {
    return {
      items: [],
      selectedIds: [],
    };
  }

  renderItems() {
    const { selectedIds, items } = this.state;

    const renderedItems = items.map(({ id, secret }) => {
      const isActive = selectedIds.includes(id);

      return (
        <ItemRow key={id}>
          <Checkbox checked={isActive} onChange={this.handleSelectRow(id)} />
          <ItemName>{secret}</ItemName>
        </ItemRow>
      );
    });

    return (
      <ListWrapper>
        <ScrollbarStyled>{renderedItems}</ScrollbarStyled>
      </ListWrapper>
    );
  }

  render() {
    const renderedItems = this.renderItems();

    return (
      <Wrapper>
        <Head title="Shared Items" />
        <AuthTitle>Someone shared items for you:</AuthTitle>
        <AuthDescription>
          You can accept or reject next shared items
        </AuthDescription>
        {renderedItems}
        <ButtonWrapper>
          <Button onClick={this.handleReject}>REJECT</Button>
          <Button onClick={this.handleAccept}>ACCEPT</Button>
        </ButtonWrapper>
      </Wrapper>
    );
  }
}

export default SharedItemsStep;
