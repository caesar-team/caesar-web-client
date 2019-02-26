import React, { Component } from 'react';
import styled from 'styled-components';
import { KEY_CODES } from 'common/constants';
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

  handleKeyDown = event => {
    const { onChange } = this.props;

    if (event.defaultPrevented) {
      return;
    }

    if (event.keyCode === KEY_CODES.ENTER) {
      const {
        target: { value },
      } = event;

      if (value) {
        this.setState(
          {
            value: '',
          },
          () => onChange(value),
        );
      }
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
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

export default ShareInput;
