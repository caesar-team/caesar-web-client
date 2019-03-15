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
import {
  encryptItem,
  decryptItem,
  getPrivateKeyObj,
} from 'common/utils/cipherUtils';
import {
  getMaskedItems,
  postItemMasks,
  deleteItemMasks,
  patchItemBatch,
} from 'common/api';

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
  justify-content: center;
  margin-top: 30px;
`;

const ButtonStyled = styled(Button)`
  height: 60px;
  font-size: 18px;
`;

class SharedItemsStep extends Component {
  state = this.prepareInitialState();

  items = null;

  async componentDidMount() {
    const { oldKeyPair, oldMasterPassword } = this.props;
    const privateKeyObj = await getPrivateKeyObj(
      oldKeyPair.encryptedPrivateKey,
      oldMasterPassword,
    );

    try {
      const {
        data: { masks },
      } = await getMaskedItems();

      const encryptedItems = await Promise.all(
        masks.map(
          // eslint-disable-next-line
          async ({ secret }) => await decryptItem(secret, privateKeyObj),
        ),
      );

      this.setState({
        items: masks.map((item, index) => ({
          ...item,
          secret: encryptedItems[index],
        })),
        selectedIds: masks.map(({ id }) => id),
      });
    } catch (e) {
      console.log(e);
    }
  }

  handleSelectRow = itemId => () => {
    this.setState(prevState => ({
      selectedIds: prevState.selectedIds.includes(itemId)
        ? prevState.selectedIds.filter(id => id !== itemId)
        : [...prevState.selectedIds, itemId],
    }));
  };

  handleAccept = async () => {
    const { currentKeyPair, onFinish = Function.prototype } = this.props;
    const { items, selectedIds } = this.state;

    const acceptedItems = items.filter(({ id }) => selectedIds.includes(id));
    const rejectedItems = items.filter(({ id }) => !selectedIds.includes(id));

    let itemIds = [];

    try {
      if (acceptedItems.length > 0) {
        const ids = acceptedItems.map(({ id }) => ({ itemMask: id }));
        const { data } = await postItemMasks({ masks: ids });

        itemIds = data.map(({ id }) => id);
      }

      if (rejectedItems.length > 0) {
        const ids = rejectedItems.map(({ id }) => ({ itemMask: id }));
        await deleteItemMasks({ masks: ids });
      }

      const decryptedAcceptedItems = await Promise.all(
        acceptedItems.map(async ({ secret, recipient }, index) => ({
          id: itemIds[index],
          userId: recipient.id,
          secret: await encryptItem(secret, currentKeyPair.publicKey),
        })),
      );

      await patchItemBatch({ collectionItems: decryptedAcceptedItems });

      onFinish();
    } catch (e) {
      console.log(e);
    }
  };

  prepareInitialState() {
    return {
      items: [],
      selectedIds: [],
    };
  }

  renderItems() {
    const { selectedIds, items } = this.state;

    const renderedItems = items.map(({ id, secret: { name } }) => {
      const isActive = selectedIds.includes(id);

      return (
        <ItemRow key={id}>
          <Checkbox checked={isActive} onChange={this.handleSelectRow(id)} />
          <ItemName>{name}</ItemName>
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
          <ButtonStyled onClick={this.handleAccept}>ACCEPT</ButtonStyled>
        </ButtonWrapper>
      </Wrapper>
    );
  }
}

export default SharedItemsStep;
