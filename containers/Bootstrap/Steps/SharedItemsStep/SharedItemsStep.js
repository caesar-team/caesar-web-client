import React, { Component, Fragment } from 'react';
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
  getOfferedItems,
  patchAcceptItem,
  patchChildItemBatch,
  getUserSelf,
} from 'common/api';
import { NavigationPanelStyled } from '../../components';
import { SHARED_ITEMS_CHECK } from '../../constants';

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
    const {
      oldKeyPair = {},
      currentKeyPair,
      oldMasterPassword,
      currentMasterPassword,
    } = this.props;

    const privateKeyObj = await getPrivateKeyObj(
      oldKeyPair.encryptedPrivateKey || currentKeyPair.encryptedPrivateKey,
      oldMasterPassword || currentMasterPassword,
    );

    try {
      const { data: items } = await getOfferedItems();
      const { data: user } = await getUserSelf();

      const decryptedItems = await Promise.all(
        items.map(
          // eslint-disable-next-line
          async ({ data }) => await decryptItem(secret, privateKeyObj),
        ),
      );

      this.setState({
        items: items.map((item, index) => ({
          ...item,
          secret: decryptedItems[index],
        })),
        selectedIds: items.map(({ id }) => id),
        user,
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
    const {
      oldKeyPair,
      currentKeyPair,
      onFinish = Function.prototype,
    } = this.props;
    const { items, selectedIds, user } = this.state;

    const acceptedItems = items.filter(({ id }) => selectedIds.includes(id));
    const ids = acceptedItems.map(({ id }) => ({ id }));

    try {
      if (acceptedItems.length > 0) {
        await patchAcceptItem({ items: ids });
      }

      if (oldKeyPair) {
        const decryptedAcceptedItems = await Promise.all(
          acceptedItems.map(async ({ secret, originalItemId }) => ({
            originalItem: originalItemId,
            items: [
              {
                userId: user.id,
                secret: await encryptItem(secret, currentKeyPair.publicKey),
              },
            ],
          })),
        );

        await patchChildItemBatch({ collectionItems: decryptedAcceptedItems });
      }

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
    const { navigationSteps } = this.props;

    const renderedItems = this.renderItems();

    return (
      <Fragment>
        <Head title="Shared Items" />
        <NavigationPanelStyled
          currentStep={SHARED_ITEMS_CHECK}
          steps={navigationSteps}
        />
        <AuthTitle>Someone shared items for you:</AuthTitle>
        <AuthDescription>
          You can accept or reject next shared items
        </AuthDescription>
        {renderedItems}
        <ButtonWrapper>
          <ButtonStyled onClick={this.handleAccept}>ACCEPT</ButtonStyled>
        </ButtonWrapper>
      </Fragment>
    );
  }
}

export default SharedItemsStep;
