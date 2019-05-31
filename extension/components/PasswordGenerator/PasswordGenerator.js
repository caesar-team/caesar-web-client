import React, { Component } from 'react';
import styled from 'styled-components';
import zxcvbn from 'zxcvbn';
import { generator } from '@caesar-utils/utils/password';
import {
  PasswordIndicator,
  Checkbox,
  RangeInput,
  Icon,
  Button,
} from '@caesar-ui';

const Wrapper = styled.div`
  margin: 10px 0;
  padding: 0 16px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
`;

const PasswordOutput = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.black};
  border-bottom: 2px solid ${({ theme }) => theme.emperor};
  height: 40px;
  width: 100%;
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PasswordIndicatorStyled = styled(PasswordIndicator)`
  width: 255px;
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

const Shape = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.gallery};
  cursor: pointer;
`;

const ShapeStyled = styled(Shape)`
  margin-left: 16px;
  width: 40px;
  height: 40px;
  user-select: none;
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

function copyTextToClipboard(text) {
  const copyFrom = document.createElement('textarea');

  copyFrom.textContent = text;
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  copyFrom.blur();
  document.body.removeChild(copyFrom);
}

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
      password: generator(length, nextOptions),
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
      password: generator(toValue, options),
      options: {
        ...options,
        length: toValue,
      },
    });
  };

  handleGenerate = () => {
    const {
      options: { length, ...otherOptions },
    } = this.state;

    this.setState({
      password: generator(length, otherOptions),
    });
  };

  handleClickCopy = () => {
    copyTextToClipboard(this.state.password);
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
      password,
      options: { digits, specials },
    } = this.state;
    const estimates = zxcvbn(password);

    return (
      <Wrapper>
        <Title>Password Generator</Title>
        <Row>
          <PasswordOutput>{password}</PasswordOutput>
          <ShapeStyled>
            <Icon
              name="dice"
              width={16}
              height={16}
              onClick={this.handleGenerate}
            />
          </ShapeStyled>
        </Row>
        <PasswordIndicatorStyled score={estimates.score} />
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
          min={8}
          max={24}
          defaultToValue={16}
          onChange={this.handleChangeLength}
        />
        <Button color="black" onClick={this.handleClickCopy}>
          Copy
        </Button>
      </Wrapper>
    );
  }
}

export default PasswordGenerator;
