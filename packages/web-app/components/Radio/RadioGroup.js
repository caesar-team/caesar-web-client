import React, { Component } from 'react';
import styled from 'styled-components';
import Radio from './Radio';

const RadioGroupStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

class RadioGroup extends Component {
  handleChange = event => {
    const { name, onChange = Function.prototype } = this.props;

    onChange(name, event.target.value);
  };

  render() {
    const {
      name,
      options,
      onChange,
      value: valueFromProps,
      ...props
    } = this.props;

    return (
      <RadioGroupStyled {...props}>
        {options.map(({ value, disabled, label, renderer, data }) => {
          const radioProps = {
            key: value,
            name,
            value,
            data,
            checked: value === valueFromProps,
            disabled,
            onChange: this.handleChange,
          };

          if (renderer) {
            return renderer({ ...radioProps });
          }

          return (
            <Radio type="radio" {...radioProps}>
              {label}
            </Radio>
          );
        })}
      </RadioGroupStyled>
    );
  }
}

RadioGroup.Radio = RadioGroup;

export default RadioGroup;
