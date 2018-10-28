import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import { Icon } from '../Icon';
import StrengthIndicator from './StrengthIndicator';

const StyledIcon = styled(({ isActive, ...props }) => <Icon {...props} />)`
  cursor: pointer;

  > svg {
    fill: ${({ isActive }) => (isActive ? '#3d70ff' : '#888b90')};
  }
`;

class PasswordInput extends PureComponent {
  state = {
    visible: false,
    value: this.props.value || '',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  handleChangeVisible = () => {
    this.setState(prevState => ({
      visible: !prevState.visible,
    }));
  };

  handleChange = event => {
    if (!this.props.value) {
      this.setState({ value: event.target.value });
    }

    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  };

  render() {
    const { value, visible } = this.state;
    const { withIndicator = false, rules, ...props } = this.props;

    const type = visible ? 'text' : 'password';

    return (
      <Fragment>
        <Input
          {...props}
          type={type}
          suffix={
            <StyledIcon
              type="eye"
              size={20}
              isActive={visible}
              onClick={this.handleChangeVisible}
            />
          }
          value={value}
          onChange={this.handleChange}
        />
        {withIndicator && <StrengthIndicator value={value} rules={rules} />}
      </Fragment>
    );
  }
}

export default PasswordInput;
