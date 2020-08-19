import React, { Component } from 'react';
import styled from 'styled-components';
// TODO: Replace with import {useClickAway} from 'react-use';
import enhanceWithClickOutside from 'react-click-outside';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

const Wrapper = styled.div`
  position: relative;
  height: 16px;
`;

const MoreIcon = styled(Icon)``;

const DottedWrapper = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  user-select: none;

  &:hover {
    ${MoreIcon} {
      color: ${({ theme }) => theme.color.black};
    }
  }
`;

class DottedMenu extends Component {
  state = this.prepareInitialState();

  handleToggle = event => {
    event.preventDefault();
    event.stopPropagation();

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
          <MoreIcon name="more" color="gray" width={16} height={16} />
        </DottedWrapper>
        <Tooltip {...tooltipProps} show={isOpened}>
          {children}
        </Tooltip>
      </Wrapper>
    );
  }
}

export default enhanceWithClickOutside(DottedMenu);
