import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import {
  Head,
  AuthTitle,
  AuthDescription,
  Checkbox,
  Button,
  Scrollbar,
  Icon,
  Avatar,
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
  getUserTeams,
  patchAcceptTeamItems,
} from 'common/api';
import { ITEM_CREDENTIALS_TYPE } from 'common/constants';
import { NavigationPanelStyled } from '../../components';
import { SHARED_ITEMS_CHECK } from '../../constants';

const ScrollbarStyled = styled(Scrollbar)`
  min-height: 300px;
  height: 100%;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};

  &:last-child {
    border-bottom: none;
  }
`;

const ItemNameAndType = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemName = styled.div`
  font-size: 16px;
  margin-left: 20px;
`;

const TeamRow = styled.div`
  display: flex;
  align-items: center;
  border-radius: 2px;
  border: 1px solid ${({ theme }) => theme.gallery};
  padding: 10px 20px;
  margin-bottom: 10px;
`;

const TeamDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const TeamName = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
`;

const TeamItemsWrapper = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonStyled = styled(Button)`
  height: 60px;
  font-size: 18px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SectionName = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.6px;
  margin-bottom: 16px;
`;

const ItemTypeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.gallery};
`;

const IconStyled = styled(Icon)`
  width: 20px;
  height: 20px;
`;

class SharedItemsStep extends Component {
  state = this.prepareInitialState();

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
      const { data: teams } = await getUserTeams();

      const { personal: personalItems, teams: teamsItems } = items;

      const decryptedItems = await Promise.all(
        personalItems.map(
          // eslint-disable-next-line
          async ({ secret }) => await decryptItem(secret, privateKeyObj),
        ),
      );

      this.setState({
        items: {
          personal: personalItems.map((item, index) => ({
            ...item,
            secret: decryptedItems[index],
          })),
          teams: teamsItems,
        },
        selectedIds: personalItems.map(({ id }) => id),
        user,
        teams,
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
      oldMasterPassword,
      currentMasterPassword,
      onFinish = Function.prototype,
    } = this.props;
    const { items, selectedIds, user } = this.state;

    const personalItems = items.personal.filter(({ id }) =>
      selectedIds.includes(id),
    );
    const personalItemIds = personalItems.map(({ id }) => ({ id }));

    const teamsItems = items.teams.reduce(
      (accumulator, { items: teamItems }) => [...accumulator, ...teamItems],
      [],
    );

    try {
      if (personalItemIds.length > 0) {
        await patchAcceptItem({ items: personalItemIds });
      }

      await patchAcceptTeamItems();

      if (oldKeyPair) {
        const privateKeyObj = await getPrivateKeyObj(
          oldKeyPair.encryptedPrivateKey || currentKeyPair.encryptedPrivateKey,
          oldMasterPassword || currentMasterPassword,
        );

        const teamItemSecrets = await Promise.all(
          teamsItems.map(
            // eslint-disable-next-line
            async ({ secret }) => await decryptItem(secret, privateKeyObj),
          ),
        );

        const allItems = [
          ...personalItems,
          ...teamsItems.map((item, index) => ({
            ...item,
            secret: teamItemSecrets[index],
          })),
        ];

        const encryptedItems = await Promise.all(
          allItems.map(async ({ secret, originalItemId }) => ({
            originalItem: originalItemId,
            items: [
              {
                userId: user.id,
                secret: await encryptItem(secret, currentKeyPair.publicKey),
              },
            ],
          })),
        );

        await patchChildItemBatch({ collectionItems: encryptedItems });
      }

      onFinish();
    } catch (e) {
      console.log(e);
    }
  };

  prepareInitialState() {
    return {
      items: {},
      selectedIds: [],
    };
  }

  renderPersonalItems() {
    const { selectedIds, items } = this.state;

    if (!items.personal) {
      return null;
    }

    const renderedItems = items.personal.map(
      ({ id, type, secret: { name } }) => {
        const isActive = selectedIds.includes(id);
        const iconName = type === ITEM_CREDENTIALS_TYPE ? 'key' : 'securenote';

        return (
          <ItemRow key={id}>
            <ItemNameAndType>
              <ItemTypeBox>
                <IconStyled name={iconName} />
              </ItemTypeBox>
              <ItemName>{name}</ItemName>
            </ItemNameAndType>
            <Checkbox checked={isActive} onChange={this.handleSelectRow(id)} />
          </ItemRow>
        );
      },
    );

    return (
      <ListWrapper>
        <ScrollbarStyled autoHeight autoHeightMax={400}>
          {renderedItems}
        </ScrollbarStyled>
      </ListWrapper>
    );
  }

  renderTeamsItems() {
    const { items, teams } = this.state;

    if (!items.teams || !teams) {
      return null;
    }

    return items.teams.map(({ id, items: teamItems }) => {
      const team = teams.find(({ id: teamId }) => teamId === id);

      return (
        <TeamRow key={id}>
          <Avatar avatar={team.icon} />
          <TeamDetails>
            <TeamName>{team.title}</TeamName>
            <TeamItemsWrapper>{teamItems.length} item(-s)</TeamItemsWrapper>
          </TeamDetails>
        </TeamRow>
      );
    });
  }

  render() {
    const { items } = this.state;
    const { navigationSteps } = this.props;

    const renderedPersonalItems = this.renderPersonalItems();
    const renderedTeamsItems = this.renderTeamsItems();

    const shouldShowPersonalItems = items.personal && items.personal.length > 0;
    const shouldShowTeamsItems = items.teams && items.teams.length > 0;

    return (
      <Fragment>
        <Head title="Shared Items" />
        <NavigationPanelStyled
          currentStep={SHARED_ITEMS_CHECK}
          steps={navigationSteps}
        />
        <AuthTitle>Someone has shared items with you</AuthTitle>
        <AuthDescription>
          You can accept or reject the following shared items
        </AuthDescription>
        {shouldShowPersonalItems && (
          <Section>
            <SectionName>New Items:</SectionName>
            {renderedPersonalItems}
          </Section>
        )}
        {shouldShowTeamsItems && (
          <Section>
            <SectionName>Team Items:</SectionName>
            {renderedTeamsItems}
          </Section>
        )}
        <ButtonWrapper>
          <ButtonStyled onClick={this.handleAccept}>Start Work</ButtonStyled>
        </ButtonWrapper>
      </Fragment>
    );
  }
}

export default SharedItemsStep;
