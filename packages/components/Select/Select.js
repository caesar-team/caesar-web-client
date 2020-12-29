import React, { useState, useRef, memo } from 'react';
import { useClickAway } from 'react-use';
import {
  Wrapper,
  SelectedOption,
  ValueText,
  IconCloseStyled,
  Box,
  OptionsList,
  Option,
  ArrowIcon,
} from './styles';

const BOX_DIRECTION_UP = 'up';
const BOX_DIRECTION_DOWN = 'down';

const DEFAULT_TOP_OFFSET = 40;
const DEFAULT_OPTION_SIZE = 40;

const renderOptions = ({ value, options, shouldBreakTextLines, handleClickOption }) =>
  options.map(({ value: optionValue, label, isDisabled = false }) => {
    const isActive = value === optionValue;

    return (
      <Option
        key={optionValue}
        isActive={isActive}
        isDisabled={isDisabled}
        shouldBreakTextLines={shouldBreakTextLines}
        onClick={
          isDisabled ? Function.prototype : handleClickOption(optionValue)
        }
      >
        {label}
      </Option>
    );
  });

const SelectComponent = ({
  name,
  value,
  options,
  placeholder,
  isCancellable,
  boxOffset = DEFAULT_TOP_OFFSET,
  boxDirection = BOX_DIRECTION_DOWN,
  shouldBreakTextLines = false,
  onChange = Function.prototype,
  className,
}) => {
  const [isDropdownOpened, setDropdownOpened] = useState(false);

  const dropdownRef = useRef(null);
  useClickAway(dropdownRef, () => {
    if (isDropdownOpened) {
      setDropdownOpened(false);
    }
  });

  const handleClickToggle = () => {
    setDropdownOpened(!isDropdownOpened);
  };

  const handleClickOption = val => () => {
    onChange(name, val);
    setDropdownOpened(false);
  };

  const handleClickCancel = event => {
    event.stopPropagation();

    onChange(name, null);
    setDropdownOpened(false);
  };

  const selectedLabel = value
    ? (options.find(({ value: optionValue }) => optionValue === value) || {})
        .label
    : placeholder;

  const topOffset =
    boxDirection === BOX_DIRECTION_DOWN
      ? boxOffset
      : null;
  const bottomOffset =
    boxDirection === BOX_DIRECTION_UP
      ? DEFAULT_OPTION_SIZE
      : null;

  return (
    <Wrapper ref={dropdownRef} className={className}>
      <SelectedOption onClick={handleClickToggle}>
        <ValueText>
          {selectedLabel}
          {isCancellable && selectedLabel && (
            <IconCloseStyled
              name="close"
              width={16}
              height={16}
              onClick={handleClickCancel}
            />
          )}
        </ValueText>
        <ArrowIcon
          name="arrow-triangle"
          width={16}
          height={16}
          isOpened={isDropdownOpened}
        />
      </SelectedOption>
      {isDropdownOpened && (
        <Box top={topOffset} bottom={bottomOffset}>
          <OptionsList>
            {renderOptions({ value, options, shouldBreakTextLines, handleClickOption })}
          </OptionsList>
        </Box>
      )}
    </Wrapper>
  );
};

SelectComponent.ValueText = ValueText;
SelectComponent.SelectedOption = SelectedOption;
SelectComponent.Option = Option;

export const Select = memo(SelectComponent);
