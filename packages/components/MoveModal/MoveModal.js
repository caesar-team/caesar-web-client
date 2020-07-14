import React, { Component } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import { upperFirst } from '@caesar/common/utils/string';
import { Modal, ModalTitle } from '../Modal';
import { Button } from '../Button';
import { Select } from '../Select';
import { ListItem } from '../List';
import { Scrollbar } from '../Scrollbar';
import { TextWithLines } from '../TextWithLines';

const ModalDescription = styled.div`
  padding-bottom: 20px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.color.black};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  margin-left: 20px;
  text-transform: uppercase;
`;

const SelectStyled = styled(Select)`
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: 3px;
  height: 48px;
`;

const SelectWrapper = styled.div`
  display: flex;
  margin: 15px 0 35px;

  & > * {
    width: 100%;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0 20px;
`;

const ListItemStyled = styled(ListItem)`
  margin-bottom: 4px;
  border-bottom: none;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const getTeamOptions = memoize((teams, currentTeamId) =>
  teams.map(({ value, label }) => ({
    value,
    label: upperFirst(label),
    isDisabled: value === currentTeamId,
  })),
);

const getListOptions = memoize((lists, currentListId) =>
  lists.map(({ value, label }) => ({
    value,
    label: upperFirst(label),
    isDisabled: value === currentListId,
  })),
);

class MoveModal extends Component {
  state = this.prepareInitialState();

  handleChangeTeamId = (_, value) => {
    this.setState({
      currentTeamId: value,
    });
  };

  handleChangeListId = (_, value) => {
    this.setState({
      currentListId: value,
    });
  };

  handleCloseItem = itemId => () => {
    this.props.onRemove(itemId);
  };

  handleClickMove = () => {
    this.props.onMove(this.state.currentListId);
  };

  prepareInitialState() {
    return {
      currentTeamId: null,
      currentListId: null,
    };
  }

  renderItems() {
    const { items } = this.props;

    return items.map(item => (
      <ListItemStyled
        isClosable
        key={item.id}
        onClickClose={this.handleCloseItem(item.id)}
        hasHover={false}
        isInModal
        {...item}
      />
    ));
  }

  render() {
    const { teamsLists, items, onCancel } = this.props;
    const { currentTeamId, currentListId } = this.state;

    const isButtonDisabled = !items.length || !currentListId;
    const renderedItems = this.renderItems();

    const teams = teamsLists.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
    const currentTeam = teamsLists.find(({ id }) => id === currentTeamId);

    const lists = currentTeam
      ? currentTeam.lists.map(({ id, label }) => ({ value: id, label }))
      : [];

    return (
      <Modal
        isOpened
        width={640}
        onRequestClose={onCancel}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
      >
        <ModalTitle>Move</ModalTitle>
        <ModalDescription>Move selected items</ModalDescription>
        <SelectWrapper>
          <SelectStyled
            placeholder="Choose a team where to move…"
            options={getTeamOptions(teams, currentTeamId)}
            value={currentTeamId}
            onChange={this.handleChangeTeamId}
          />
        </SelectWrapper>
        {currentTeamId && (
          <SelectWrapper>
            <SelectStyled
              placeholder="Choose a list where to move…"
              options={getListOptions(lists, currentListId)}
              value={currentListId}
              onChange={this.handleChangeListId}
            />
          </SelectWrapper>
        )}
        <TextWithLines position="left" width={1}>
          Selected items ({items.length})
        </TextWithLines>
        <ListWrapper>
          <Scrollbar autoHeight autoHeightMax={400}>
            {renderedItems}
          </Scrollbar>
        </ListWrapper>
        <ButtonsWrapper>
          <StyledButton color="white" onClick={onCancel}>
            Cancel
          </StyledButton>
          <StyledButton
            color="black"
            onClick={this.handleClickMove}
            disabled={isButtonDisabled}
          >
            Move
          </StyledButton>
        </ButtonsWrapper>
      </Modal>
    );
  }
}

export default MoveModal;
