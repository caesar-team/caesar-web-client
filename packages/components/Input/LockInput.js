import React, { Component } from 'react';
import styled from 'styled-components';
import { KEY_CODES } from '@caesar/common/constants';
import { media } from '@caesar/assets/styles/media';
import { Input } from './Input';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.color.darkGray};
  min-width: 400px;

  ${media.mobile`
    min-width: 288px;
  `}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 60px;
`;

const StyledArrowIcon = styled(Icon)`
  margin-right: 24px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.white};
  }
`;

const StyledInput = styled(Input)`
  ${Input.InputField} {
    color: ${({ theme, isError }) =>
      isError ? theme.color.red : theme.color.white};
    background-color: transparent;
    height: 58px;
    width: 100%;
    padding-right: 20px;
    padding-left: 8px;
  }
`;

class LockInput extends Component {
  onKeyDown = e => {
    const { isError, onBackspace } = this.props;

    if (isError && e.keyCode === KEY_CODES.BACKSPACE && onBackspace) {
      onBackspace();
    }
  };

  render() {
    const { isError, onClick, onBackspace, ...props } = this.props;

    return (
      <Wrapper>
        <InnerWrapper isError={isError}>
          <IconWrapper isError={isError}>
            <Icon
              name="lock"
              width={24}
              height={24}
              color={isError ? 'red' : 'white'}
            />
          </IconWrapper>
          <StyledInput
            {...props}
            isError={isError}
            onKeyDown={this.onKeyDown}
            type="password"
            autocomplete="off"
          />
          <StyledArrowIcon
            name="arrow"
            width={20}
            height={20}
            color="lightGray"
            onClick={onClick}
          />
        </InnerWrapper>
      </Wrapper>
    );
  }
}

export default LockInput;
