import enhanceWithClickOutside from 'react-click-outside';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '../Button';

const ListOptionsWrapper = styled.div`
  position: relative;
`;

const ListOptionsMenu = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const ListOptionsButton = styled.button`
  display: flex;
  flex-direction: column;
  width: 14px;
  height: 14px;
  margin-left: 12px;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  transition: 0.3s;

  &:hover {
    opacity: 0.75;
  }

  span {
    display: block;
    width: 2px;
    height: 2px;
    background-color: ${({ theme }) => theme.gray};
    border-radius: 50%;

    &:nth-child(2) {
      margin-top: 4px;
      margin-bottom: 4px;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

class ListOptionsInner extends Component {
  state = {
    isMenuShown: false,
  };

  showMenuToggle = () => {
    this.setState(prevState => ({
      isMenuShown: !prevState.isMenuShown,
    }));
  };

  handleClickOutside() {
    this.setState({ isMenuShown: false });
  }

  render() {
    const { isMenuShown } = this.state;
    const { onClickRemoveList, onClickEditList, listId } = this.props;

    return (
      <ListOptionsWrapper>
        <ListOptionsButton onClick={this.showMenuToggle}>
          <span />
          <span />
          <span />
        </ListOptionsButton>
        {isMenuShown && (
          <ListOptionsMenu>
            <StyledButton color="white" onClick={onClickEditList(listId)}>
              Edit
            </StyledButton>
            <StyledButton color="white" onClick={onClickRemoveList(listId)}>
              Remove
            </StyledButton>
          </ListOptionsMenu>
        )}
      </ListOptionsWrapper>
    );
  }
}

export const ListOptions = enhanceWithClickOutside(ListOptionsInner);
