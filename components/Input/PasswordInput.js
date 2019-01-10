import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Input from './Input';
import { Icon } from '../Icon';

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

class PasswordInput extends PureComponent {
  state = {
    visible: false,
  };

  handleChangeVisible = () => {
    this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  };

  render() {
    const { visible } = this.state;
    const { value, ...props } = this.props;

    const type = visible ? 'text' : 'password';
    const iconName = visible ? 'eye-off' : 'eye-on';

    return (
      <Input
        {...props}
        value={value}
        type={type}
        postfix={
          value && (
            <StyledIcon
              name={iconName}
              width={18}
              height={18}
              onClick={this.handleChangeVisible}
            />
          )
        }
      />
    );
  }
}

PasswordInput.InputField = Input.InputField;
PasswordInput.PostFix = Input.PostFix;

export default PasswordInput;
