import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Lists,
  ListOption,
  Item,
  PasswordGenerator,
  Loader,
} from '@caesar/components';
import { Icon, Scrollbar } from '@caesar-ui';

const Wrapper = styled.div`
  display: flex;
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 240px;
  width: 100%;
  min-height: 100vh;
  border-right: 1px solid ${({ theme }) => theme.color.gallery};
  background: ${({ theme }) => theme.color.snow};
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const TopLists = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
`;

const GeneratorOption = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
  cursor: pointer;
  max-height: 40px;
  min-height: 40px;
`;

const GeneratorOptionName = styled.div`
  font-size: 16px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  color: ${({ theme }) => theme.color.black};
  margin-left: 16px;
`;

const MODE = {
  ITEM: 'ITEM_MODE',
  PASSWORD_GENERATOR: 'PASSWORD_GENERATOR_MODE',
};

class Dashboard extends Component {
  state = this.prepareInitialState();

  componentDidMount() {
    this.props.fetchNodesRequest(true);
  }

  handleChangeMode = () => {
    this.props.setWorkInProgressListId(null);
    this.props.setWorkInProgressItem(null);

    this.setState({
      mode: MODE.PASSWORD_GENERATOR,
    });
  };

  handleClickList = listId => () => {
    const { workInProgressList } = this.props;

    this.props.setWorkInProgressListId(
      workInProgressList && workInProgressList.id === listId ? null : listId,
    );

    this.setState({
      mode: MODE.ITEM,
    });
  };

  handleClickItem = itemId => event => {
    event.preventDefault();
    event.stopPropagation();

    this.props.setWorkInProgressItem(this.props.itemsById[itemId]);
  };

  prepareInitialState() {
    return {
      mode: MODE.ITEM,
    };
  }

  renderFavorites() {
    const { mode } = this.state;
    const {
      workInProgressList,
      favoritesList,
      visibleListItems,
      workInProgressItem,
    } = this.props;

    const isActive =
      mode !== MODE.PASSWORD_GENERATOR &&
      workInProgressList &&
      favoritesList.id === workInProgressList.id;

    return (
      <ListOption
        icon="favorite"
        list={favoritesList}
        items={visibleListItems}
        workInProgressItem={workInProgressItem}
        isActive={isActive}
        onClickItem={this.handleClickItem}
        onClickList={this.handleClickList}
      />
    );
  }

  renderPasswordGenerator() {
    const { mode } = this.state;

    const isActive = mode === MODE.PASSWORD_GENERATOR;

    return (
      <GeneratorOption onClick={this.handleChangeMode}>
        <Icon name="lock" width={16} height={18} />
        <GeneratorOptionName isActive={isActive}>
          Password Generator
        </GeneratorOptionName>
      </GeneratorOption>
    );
  }

  render() {
    const { mode } = this.state;
    const {
      isLoading,
      lists,
      workInProgressList,
      workInProgressItem,
      visibleListItems,
    } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    const renderedFavorites = this.renderFavorites();
    const renderedPasswordGenerator = this.renderPasswordGenerator();

    return (
      <Wrapper>
        <LeftWrapper>
          <Scrollbar>
            <TopLists>
              {renderedFavorites}
              {renderedPasswordGenerator}
            </TopLists>
            <Lists
              lists={lists}
              workInProgressList={workInProgressList}
              workInProgressItem={workInProgressItem}
              visibleListItems={visibleListItems}
              onClickList={this.handleClickList}
              onClickItem={this.handleClickItem}
            />
          </Scrollbar>
        </LeftWrapper>
        <RightWrapper>
          {mode === MODE.ITEM ? (
            <Item item={workInProgressItem} />
          ) : (
            <PasswordGenerator />
          )}
        </RightWrapper>
      </Wrapper>
    );
  }
}

export default Dashboard;
