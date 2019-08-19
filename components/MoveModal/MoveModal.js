import React, { Component } from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import {
  Modal,
  ModalTitle,
  Button,
  Select,
  TextWithLines,
  ListItem,
  Scrollbar,
} from 'components';
import { upperFirst } from 'common/utils/string';
import { TRASH_TYPE } from '../../common/constants';

const ModalDescription = styled.div`
  padding-bottom: 20px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.black};
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
  border: 1px solid ${({ theme }) => theme.gallery};
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

const getOptions = memoize((lists, removedListId, activeListId) =>
  lists
    .filter(({ id, type }) => type !== TRASH_TYPE && id !== removedListId)
    .map(({ label, id }) => ({
      value: id,
      label: upperFirst(label),
      isDisabled: id === activeListId,
    })),
);

class MoveModal extends Component {
  state = this.prepareInitialState();

  handleChangeListId = (_, value) => {
    this.setState({
      activeListId: value,
    });
  };

  handleCloseItem = itemId => () => {
    this.props.onRemove(itemId);
  };

  handleClickMove = () => {
    this.props.onMove(this.state.activeListId);
  };

  prepareInitialState() {
    return {
      activeListId: null,
    };
  }

  renderItems() {
    const { items } = this.props;

    return items.map(item => (
      <ListItemStyled
        isClosable
        key={item.id}
        onClickClose={this.handleCloseItem(item.id)}
        {...item}
      />
    ));
  }

  render() {
    const { lists, items, workInProgressListId, onCancel } = this.props;
    const { activeListId } = this.state;

    const isButtonDisabled = !items.length || !activeListId;
    const renderedItems = this.renderItems();

    return (
      <Modal
        isOpen
        width={640}
        onRequestClose={onCancel}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
      >
        <ModalTitle>Move</ModalTitle>
        <ModalDescription>Move selected items</ModalDescription>
        <SelectWrapper>
          <SelectStyled
            placeholder="Choose a list where to move…"
            options={getOptions(lists, workInProgressListId, activeListId)}
            value={activeListId}
            onChange={this.handleChangeListId}
          />
        </SelectWrapper>
        <TextWithLines>Selected ({items.length})</TextWithLines>
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
