import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Checkbox } from '../Checkbox';
import { RangeInput } from '../RangeInput';

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
    color: ${({ theme }) => theme.color.black};
  }
`;

const LengthText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.black};
`;

const RangeInputStyled = styled(RangeInput)`
  width: 100%;
  margin: 10px 0 30px;
`;

const MIN_LENGTH = 8;
const MAX_LENGTH = 24;

const PasswordGenerator = forwardRef(
  (
    {
      length,
      digits,
      specials,
      onChangeOption = Function.prototype,
      className,
    },
    ref,
  ) => (
    <Wrapper className={className} ref={ref}>
      <Options>
        <CheckboxStyled checked={digits} onChange={onChangeOption('digits')}>
          Use digits
        </CheckboxStyled>
        <CheckboxStyled
          checked={specials}
          onChange={onChangeOption('specials')}
        >
          Use special characters
        </CheckboxStyled>
      </Options>
      <LengthText>Length</LengthText>
      <RangeInputStyled
        name="length"
        min={MIN_LENGTH}
        max={MAX_LENGTH}
        defaultToValue={length}
        onChange={onChangeOption('length')}
      />
    </Wrapper>
  ),
);

export default PasswordGenerator;
