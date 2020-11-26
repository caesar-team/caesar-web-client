import React, { Component } from 'react';
import styled from 'styled-components';
import { Tooltip } from '../../Tooltip';
import { Icon } from '../../Icon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CloseIcon = styled(Icon)`
  margin-left: 20px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
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
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.color.black};
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
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
        <CloseIcon
          name="close"
          width={16}
          height={16}
          color="gray"
          className={className}
          onClick={onClick}
        />
      </Wrapper>
    );
  }
}

export default RemoveControl;
