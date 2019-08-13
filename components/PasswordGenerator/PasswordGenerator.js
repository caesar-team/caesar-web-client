import React, { Component } from 'react';
import styled from 'styled-components';
import { generator } from 'common/utils/password';
import { Checkbox, RangeInput } from 'components';

const Wrapper = styled.div`
  margin: 10px 0;
  padding: 0 16px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;

  > label {
    margin-top: 16px;

    &:last-child {
      margin-bottom: 16px;
    }
  }
`;

const CheckboxStyled = styled(Checkbox)`
  ${Checkbox.Text} {
    font-size: 14px;
    letter-spacing: 0.4px;
    color: ${({ theme }) => theme.black};
  }
`;

const LengthText = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.black};
`;

const RangeInputStyled = styled(RangeInput)`
  width: 255px;
  margin: 10px 0 30px;
`;

const DEFAULT_LENGTH = 16;
const MIN_LENGTH = 8;
const MAX_LENGTH = 24;

class PasswordGenerator extends Component {
  state = this.prepareInitialState();

  handleChangeOption = option => () => {
    const {
      options: { length, ...options },
    } = this.state;
    const nextOptions = {
      ...options,
      [option]: !options[option],
    };

    this.setState({
      options: {
        length,
        ...nextOptions,
      },
    });
  };

  handleChangeLength = ({
    target: {
      value: { toValue },
    },
  }) => {
    const {
      options: { length, ...options },
    } = this.state;

    this.setState({
      options: {
        ...options,
        length: toValue,
      },
    });
  };

  handleGenerate = () => {
    const { onGeneratePassword } = this.props;
    const {
      options: { length, ...otherOptions },
    } = this.state;

    onGeneratePassword(generator(length, otherOptions));
  };

  prepareInitialState() {
    const options = {
      digits: true,
      specials: true,
    };

    return {
      password: generator(DEFAULT_LENGTH, options),
      options: {
        ...options,
        length: DEFAULT_LENGTH,
      },
    };
  }

  render() {
    const {
      options: { digits, specials },
    } = this.state;

    return (
      <Wrapper>
        <Options>
          <CheckboxStyled
            checked={digits}
            onChange={this.handleChangeOption('digits')}
          >
            Use digits
          </CheckboxStyled>
          <CheckboxStyled
            checked={specials}
            onChange={this.handleChangeOption('specials')}
          >
            Use special characters
          </CheckboxStyled>
        </Options>
        <LengthText>Length</LengthText>
        <RangeInputStyled
          name="length"
          min={MIN_LENGTH}
          max={MAX_LENGTH}
          defaultToValue={DEFAULT_LENGTH}
          onChange={this.handleChangeLength}
        />
      </Wrapper>
    );
  }
}

export default PasswordGenerator;
