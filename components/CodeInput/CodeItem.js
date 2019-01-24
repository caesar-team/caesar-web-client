import React, { Component } from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  width: 40px;
  height: 62px;
  margin-right: 5px;
  font-size: 35px;
  text-align: center;
  border-radius: 3px;
  border: none;
  outline: none;
  background: ${({ errors, theme }) =>
    Object.keys(errors).length === 0 ? theme.lightBlue : theme.lightRed};

  &:last-child {
    margin-right: 0;
  }
`;

export class CodeItem extends Component {
  state = {
    value: '',
  };

  onKeyDown = e => {
    const {
      onBackspace,
      resetFormOnBackspace = Function.prototype,
    } = this.props;

    if (e.keyCode === 8 && (!this.state.value || !this.state.value.length)) {
      onBackspace();
    }

    if (e.keyCode === 8 && Object.keys(this.props.errors).length !== 0) {
      resetFormOnBackspace();
    }
  };

  onChange = e => {
    const value = this.validate(e.target.value);
    if (this.state.value === value) return;
    if (value.length < 2) {
      this.setState({ value });
      this.props.onChange(value);
    }
  };

  validate = value => {
    const numCode = value.charCodeAt(0);
    const isInteger =
      numCode >= '0'.charCodeAt(0) && numCode <= '9'.charCodeAt(0);
    return isInteger ? value : '';
  };

  render() {
    const { createRef, disabled, errors } = this.props;
    const { value } = this.state;

    return (
      <StyledInput
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
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
