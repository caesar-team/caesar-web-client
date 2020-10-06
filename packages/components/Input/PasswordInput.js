import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Input } from './Input';
import { Icon } from '../Icon';
import { HoldClickBehaviour } from '../HoldClickBehaviour';

const EyeIcon = styled(Icon)`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
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
    const {
      value,
      addonPostfix,
      isAlwaysVisibleIcon = false,
      ...props
    } = this.props;

    const type = visible ? 'text' : 'password';
    const iconName = visible ? 'eye-off' : 'eye-on';

    const shouldShowIcon = isAlwaysVisibleIcon || value;

    return (
      <Input
        {...props}
        value={value}
        type={type}
        postfix={
          <>
            {addonPostfix}
            {shouldShowIcon && (
              <HoldClickBehaviour
                onHoldStart={this.handleToggleVisible(true)}
                onHoldEnd={this.handleToggleVisible(false)}
              >
                <EyeIcon name={iconName} width={16} height={16} color="gray" />
              </HoldClickBehaviour>
            )}
          </>
        }
      />
    );
  }
}

PasswordInput.InputField = Input.InputField;
PasswordInput.Prefix = Input.Prefix;
PasswordInput.PostFix = Input.PostFix;

export default PasswordInput;
