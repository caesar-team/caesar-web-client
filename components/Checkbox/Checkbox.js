import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
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
`;

const StyledInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;

export default class Checkbox extends Component {
  state = {
    isChecked: false,
    isFocused: false,
  };

  handleChangeToggle = () => {
    this.setState(prevState => {
      const { onChange } = this.props;
      const checked = !prevState.isChecked;

      if (onChange && typeof onChange === 'function') onChange(checked);

      return { isChecked: checked };
    });
  };

  handleFocusToggle = () => {
    this.setState(prevState => ({ isFocused: !prevState.isFocused }));
  };

  render() {
    const { isChecked, isFocused } = this.state;
    const { children } = this.props;

    return (
      <StyledLabel>
        <Box isChecked={isChecked} isFocused={isFocused}>
          <Icon name="check" isInButton width={14} height={10} />
        </Box>
        <StyledInput
          type="checkbox"
          checked={isChecked}
          onChange={this.handleChangeToggle}
          onFocus={this.handleFocusToggle}
          onBlur={this.handleFocusToggle}
        />
        {children && <Text>{children}</Text>}
      </StyledLabel>
    );
  }
}
