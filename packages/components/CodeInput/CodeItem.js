import React, { Component } from 'react';
import styled from 'styled-components';
import { KEY_CODES } from '@caesar/common/constants';
import { pastFromClipboard } from '@caesar/common/utils/clipboard';

const StyledInput = styled.input`
  width: 40px;
  height: 62px;
  margin-right: 5px;
  font-size: 35px;
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: none;
  outline: none;
  background: ${({ errors, theme }) =>
    Object.keys(errors).length === 0 ? theme.color.snow : theme.color.lightRed};

  &:last-child {
    margin-right: 0;
  }
`;

export class CodeItem extends Component {
  state = {
    value: '',
  };

  static getDerivedStateFromProps(nextProps) {
    // The state without cache is a reasonable solution for this place.
    return {
      value: nextProps.value,
    };
  }

  onPaste = e => {
    // Stop the data being pasted into the element.
    e.stopPropagation();
    e.preventDefault();

    const pastedData = pastFromClipboard(e);
    if (pastedData != null && pastedData.length > 0) {
      this.props.onPaste(pastedData);
    }
  };

  onKeyDown = e => {
    const {
      onBackspace,
      resetFormOnBackspace = Function.prototype,
    } = this.props;

    if (
      e.keyCode === KEY_CODES.BACKSPACE &&
      (!this.state.value || !this.state.value.length)
    ) {
      onBackspace();
    }

    if (
      e.keyCode === KEY_CODES.BACKSPACE &&
      Object.keys(this.props.errors).length !== 0
    ) {
      resetFormOnBackspace();
    }
  };

  onChange = e => {
    const value = this.validate(e.target.value);
    if (this.state.value === value) return;
    this.setState({ value });
    this.props.onChange(value);
  };

  validate = value => {
    return /^[0-9]$/.test(value) ? value : '';
  };

  render() {
    const { createRef, disabled, errors } = this.props;
    const { value } = this.state;

    return (
      <StyledInput
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onPaste={this.onPaste}
        maxLength="1"
        autoComplete="off"
        ref={createRef}
        onBlur={this.onBlur}
        value={value}
        disabled={disabled}
        errors={errors}
      />
    );
  }
}
