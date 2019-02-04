import React, { Component } from 'react';
import styled from 'styled-components';
import { CodeItem } from './CodeItem';

const Wrapper = styled.div`
  display: flex;
`;

class CodeInput extends Component {
  values = this.generateValues();

  elements = this.values.map(() => undefined);

  componentDidMount() {
    if (this.props.focus && this.props.length) this.elements[0].focus();
  }

  createElementsRefs = (ref, index) => {
    this.elements[index] = ref;
  };

  onItemChange = (value, index) => {
    const {
      length,
      onComplete = Function.prototype,
      onChange = Function.prototype,
    } = this.props;
    let currentIndex = index;
    this.values = this.values.map((v, i) => (i === index ? value : v));

    if (value.length === 1 && index < length - 1) {
      currentIndex += 1;
      this.elements[currentIndex].focus();
    }

    const pin = this.values.join('');
    onChange(pin, currentIndex);

    if (pin.length === length) {
      onComplete();
    }
  };

  onBackspace = index => {
    if (index > 0) {
      this.elements[index - 1].focus();
    }
  };

  generateValues() {
    const { length = 1 } = this.props;

    return new Array(length).join('0').split('0');
  }

  render() {
    const { disabled, errors, onCompleteWithErrors } = this.props;

    return (
      <Wrapper>
        {this.values.map((e, i) => (
          <CodeItem
            createRef={ref => this.createElementsRefs(ref, i)}
            key={i}
            index={i}
            onBackspace={() => this.onBackspace(i)}
            resetFormOnBackspace={onCompleteWithErrors}
            onChange={v => this.onItemChange(v, i)}
            disabled={disabled}
            errors={errors}
          />
        ))}
      </Wrapper>
    );
  }
}

export default CodeInput;
