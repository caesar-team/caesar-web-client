import React, { Component } from 'react';
import styled from 'styled-components';
import { KEY_CODES } from '@caesar/common/constants';
import Input from './Input';
import Icon from '../Icon/Icon';

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
`;

const StyledInput = styled(Input)`
  border: 1px solid ${({ theme }) => theme.gallery};
  padding-left: 35px;

  ${Input.InputField} {
    font-size: 16px;
    padding: 15px 20px;
  }
`;

class ShareInput extends Component {
  state = {
    value: '',
  };

  handleChange = event => {
    event.preventDefault();

    this.setState({
      value: event.target.value,
    });
  };

  handleBlur = () => {
    this.clearAndSendValue();
  };

  handleKeyDown = event => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.keyCode === KEY_CODES.ENTER) {
      this.clearAndSendValue();
    }
  };

  clearAndSendValue = () => {
    const { onChange } = this.props;
    const { value } = this.state;

    if (value && value.length > 0) {
      this.setState(
        {
          value: '',
        },
        () => onChange(value),
      );
    }
  };

  render() {
    const { value } = this.state;

    return (
      <StyledInput
        {...this.props}
        value={value}
        placeholder="Enter email addresses"
        prefix={<StyledIcon name="at" width={18} height={18} />}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

export default ShareInput;
