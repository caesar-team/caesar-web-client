import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;

  pointer-events: ${({ isDisabled }) => isDisabled && 'none'};
`;

const Box = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.white};
  border: 1px solid
    ${({ isChecked, theme }) => (isChecked ? theme.black : theme.gallery)};
  border-radius: 2px;
  background-color: ${({ isChecked, theme }) =>
    isChecked ? theme.black : theme.white};
  transition: 0.3s;
  ${({ isFocused, theme }) => isFocused && `border-color: ${theme.black}`};
`;

const Text = styled.span`
  padding-left: 10px;
  color: ${({ theme, isDisabled }) => isDisabled && theme.gray};
`;

const StyledInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;

export default class Checkbox extends Component {
  state = {
    isChecked: this.props.isChecked,
    isFocused: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.isChecked !== nextProps.isChecked)
      return { isChecked: nextProps.isChecked };

    return null;
  }

  handleChangeToggle = () => {
    this.setState(prevState => {
      const { onChange } = this.props;
      const checked = !prevState.isChecked;

      if (onChange && typeof onChange === 'function') {
        onChange(checked);
        return {};
      }

      return { isChecked: checked };
    });
  };

  handleFocusToggle = () => {
    this.setState(prevState => ({ isFocused: !prevState.isFocused }));
  };

  render() {
    const { isChecked, isFocused } = this.state;
    const { children, isDisabled } = this.props;

    return (
      <StyledLabel isDisabled={isDisabled}>
        <Box isChecked={isChecked} isFocused={isFocused}>
          <Icon name="check" isInButton width={14} height={10} />
        </Box>
        <StyledInput
          type="checkbox"
          checked={isChecked}
          disabled={isDisabled}
          onChange={this.handleChangeToggle}
          onFocus={this.handleFocusToggle}
          onBlur={this.handleFocusToggle}
        />
        {children && <Text isDisabled={isDisabled}>{children}</Text>}
      </StyledLabel>
    );
  }
}
