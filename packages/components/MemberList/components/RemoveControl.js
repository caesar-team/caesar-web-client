import React, { Component } from 'react';
import styled from 'styled-components';
import { Tooltip } from '../../Tooltip';
import { Icon } from '../../Icon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CloseIcon = styled(Icon)`
  width: 10px;
  height: 10px;
  fill: ${({ theme }) => theme.color.gray};
  cursor: pointer;
  margin-left: 20px;
`;

const WarningWrapper = styled.div`
  display: flex;
  position: relative;
`;

const WarningIcon = styled(Icon)`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const TooltipText = styled.div`
  display: flex;
  align-items: center;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.color.black};
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.color.white};
`;

class RemoveControl extends Component {
  state = this.prepareInitialState();

  handleToggle = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened,
    }));
  };

  prepareInitialState() {
    return {
      isOpened: false,
    };
  }

  render() {
    const { isOpened } = this.state;
    const { className, member, onClick } = this.props;

    return (
      <Wrapper>
        {member.isNew && (
          <WarningWrapper>
            <WarningIcon
              name="warning"
              onMouseEnter={this.handleToggle}
              onMouseLeave={this.handleToggle}
            />
            <Tooltip
              show={isOpened}
              position="left center"
              textBoxWidth="256px"
              backgroundColor="black"
            >
              <TooltipText>User isn’t registered in your domain.</TooltipText>
            </Tooltip>
          </WarningWrapper>
        )}
        <CloseIcon name="close" className={className} onClick={onClick} />
      </Wrapper>
    );
  }
}

export default RemoveControl;
