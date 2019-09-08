import React, { Component } from 'react';
import styled from 'styled-components';
import enhanceWithClickOutside from 'react-click-outside';
import { Tooltip } from '../Tooltip';

const Wrapper = styled.div`
  position: relative;
  height: 16px;
`;

const DottedWrapper = styled.button`
  display: flex;
  flex-direction: column;
  width: 14px;
  height: 14px;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  transition: 0.3s;
  user-select: none;

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

class DottedMenu extends Component {
  state = this.prepareInitialState();

  handleToggle = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened,
    }));
  };

  handleClickOutside() {
    this.setState({ isOpened: false });
  }

  prepareInitialState() {
    return {
      isOpened: false,
    };
  }

  render() {
    const { isOpened } = this.state;
    const { className, children, tooltipProps = {} } = this.props;

    return (
      <Wrapper className={className}>
        <DottedWrapper onClick={this.handleToggle}>
          <span />
          <span />
          <span />
        </DottedWrapper>
        <Tooltip {...tooltipProps} show={isOpened}>
          {children}
        </Tooltip>
      </Wrapper>
    );
  }
}

export default enhanceWithClickOutside(DottedMenu);
