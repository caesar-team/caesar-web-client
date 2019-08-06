import React, { Component } from 'react';
import styled from 'styled-components';
import { ITEM_REVIEW_MODE } from '@caesar-utils/constants';
import { Lists, ListOption, Item, PasswordGenerator, Loader } from 'components';
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
  border-right: 1px solid ${({ theme }) => theme.gallery};
  background: ${({ theme }) => theme.snow};
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
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  cursor: pointer;
  max-height: 40px;
  min-height: 40px;
`;

const GeneratorOptionName = styled.div`
  font-size: 16px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
  margin-left: 16px;
`;

const ITEM_MODE = 'ITEM_MODE';
const PASSWORD_GENERATOR_MODE = 'PASSWORD_GENERATOR_MODE';

class Dashboard extends Component {
  state = this.prepareInitialState();

  componentDidMount() {
    this.props.fetchNodesRequest(true);
  }

  handleChangeMode = () => {
    this.props.setWorkInProgressListId(null);
    this.props.setWorkInProgressItem(null);

    this.setState({
      mode: PASSWORD_GENERATOR_MODE,
    });
  };

  handleClickList = listId => () => {
    const { workInProgressList } = this.props;

    this.props.setWorkInProgressListId(
      workInProgressList && workInProgressList.id === listId ? null : listId,
    );

    this.setState({
      mode: ITEM_MODE,
    });
  };

  handleClickItem = itemId => event => {
    event.preventDefault();
    event.stopPropagation();

    this.props.setWorkInProgressItem(
      this.props.itemsById[itemId],
      ITEM_REVIEW_MODE,
    );
  };

  prepareInitialState() {
    return {
      mode: ITEM_MODE,
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
      mode !== PASSWORD_GENERATOR_MODE &&
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

    const isActive = mode === PASSWORD_GENERATOR_MODE;

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
          {mode === ITEM_MODE ? (
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
