import React, { useState, useRef, memo } from 'react';
import { useUpdateEffect, useClickAway } from 'react-use';
import styled from 'styled-components';
import { passwordGenerator } from '@caesar/common/utils/passwordGenerator';
import { Icon } from '../Icon';
import { PasswordGenerator } from '../PasswordGenerator';
import { Tooltip } from '../Tooltip';

const Wrapper = styled.div`
  position: relative;
`;

const DiceIcon = styled(Icon)`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const DEFAULT_LENGTH = 16;

const TooltipPasswordGeneratorComponent = ({
  tooltipProps,
  onGeneratePassword,
  className,
}) => {
  const [isVisible, setVisible] = useState(false);
  const [state, setState] = useState({
    length: DEFAULT_LENGTH,
    digits: true,
    specials: true,
  });
  const { length, digits, specials } = state;
  const tooltipRef = useRef(null);

  const getLengthValue = event => event.target.value.toValue;

  const getOptionValue = optionType => {
    const { [optionType]: value } = state;

    return !value;
  };

  const onGeneratePasswordCallback = () =>
    onGeneratePassword(passwordGenerator(length, { digits, specials }));

  const handleChangeOption = optionType => event => {
    const value =
      optionType === 'length'
        ? getLengthValue(event)
        : getOptionValue(optionType);

    setState({
      ...state,
      [optionType]: value,
    });
  };

  useClickAway(tooltipRef, () => setVisible(false));

  useUpdateEffect(() => {
    if (isVisible) {
      onGeneratePasswordCallback();
    }
  }, [isVisible, state]);

  return (
    <Wrapper ref={tooltipRef} className={className}>
      <DiceIcon
        name="dice"
        width={20}
        height={20}
        color="gray"
        onClick={() => setVisible(true)}
      />
      <Tooltip
        show={isVisible}
        arrowAlign="start"
        position="right center"
        textBoxWidth="300px"
        moveRight="8px"
        {...tooltipProps}
      >
        <PasswordGenerator
          length={length}
          digits={digits}
          specials={specials}
          onChangeOption={handleChangeOption}
        />
      </Tooltip>
    </Wrapper>
  );
};

export const TooltipPasswordGenerator = memo(TooltipPasswordGeneratorComponent);
