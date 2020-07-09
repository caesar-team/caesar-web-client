import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Input } from './Input';
import { Icon } from '../Icon';
import { HoldClickBehaviour } from '../HoldClickBehaviour';

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

class PasswordInput extends PureComponent {
  state = {
    visible: false,
  };

  handleToggleVisible = visible => () => {
    this.setState({
      visible,
    });
  };

  render() {
    const { visible } = this.state;
    const { value, isAlwaysVisibleIcon = false, ...props } = this.props;

    const type = visible ? 'text' : 'password';
    const iconName = visible ? 'eye-off' : 'eye-on';

    const shouldShowIcon = isAlwaysVisibleIcon || value;

    return (
      <Input
        {...props}
        value={value}
        type={type}
        postfix={
          shouldShowIcon && (
            <HoldClickBehaviour
              onHoldStart={this.handleToggleVisible(true)}
              onHoldEnd={this.handleToggleVisible(false)}
            >
              <StyledIcon name={iconName} width={18} height={18} />
            </HoldClickBehaviour>
          )
        }
      />
    );
  }
}

PasswordInput.InputField = Input.InputField;
PasswordInput.Prefix = Input.Prefix;
PasswordInput.PostFix = Input.PostFix;

export default PasswordInput;
