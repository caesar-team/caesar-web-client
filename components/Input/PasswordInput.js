import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Input from './Input';
import { Icon } from '../Icon';
import { LongClickBehaviour } from '../LongClickBehaviour';

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
            <LongClickBehaviour
              onLongClickStart={this.handleToggleVisible(true)}
              onLongClickEnd={this.handleToggleVisible(false)}
            >
              <StyledIcon
                name={iconName}
                width={18}
                height={18}
                onClick={this.handleChangeVisible}
              />
            </LongClickBehaviour>
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
