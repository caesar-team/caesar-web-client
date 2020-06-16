import React, { Component } from 'react';
import styled from 'styled-components';
// TODO: Replace with import {useClickAway} from 'react-use';
import enhanceWithClickOutside from 'react-click-outside';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: ${({ theme }) => theme.color.white};
`;

const SelectedOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
  padding: 5px 15px;
  cursor: pointer;

  &[disabled] {
    pointer-events: none;
  }
`;

const ValueText = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: ${({ theme }) => theme.color.black};
  position: relative;
  width: 100%;
`;

const IconCloseStyled = styled(Icon)`
  position: absolute;
  right: 20px;
`;

const Box = styled.div`
  position: absolute;
  top: ${({ top }) => `${top}px`};
  z-index: ${({ theme }) => theme.z.basic};
  width: 100%;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: 3px;
  width: 100%;
`;

const Option = styled.div`
  display: flex;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.color.lightGray : theme.color.emperor};
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.color.snow : theme.color.white};
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};

  &:hover {
    color: ${({ theme, isDisabled }) =>
      isDisabled ? theme.color.lightGray : theme.color.black};
  }
`;

const ArrowIcon = styled(Icon)`
  transform: ${({ isOpened }) => (isOpened ? 'scaleY(-1)' : 'scaleY(1)')};
  transition: transform 0.2s;
`;

const BOX_DIRECTION_DOWN = 'down';

const DEFAULT_TOP_OFFSET = 48;
const DEFAULT_OPTION_SIZE = 36;

class SelectInner extends Component {
  state = {
    isOpened: false,
  };

  handleClickToggle = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened,
    }));
  };

  handleClick = value => () => {
    const { name, onChange = Function.prototype } = this.props;

    this.setState(
      {
        isOpened: false,
      },
      () => onChange(name, value),
    );
  };

  handleClickCancel = event => {
    event.stopPropagation();

    const { name, onChange = Function.prototype } = this.props;

    this.setState(
      {
        isOpened: false,
      },
      () => onChange(name, null),
    );
  };

  handleClickOutside() {
    this.setState({
      isOpened: false,
    });
  }

  renderOptions() {
    const { value, options } = this.props;

    return options.map(({ value: optionValue, label, isDisabled = false }) => {
      const isActive = value === optionValue;

      return (
        <Option
          key={optionValue}
          isActive={isActive}
          isDisabled={isDisabled}
          onClick={
            isDisabled ? Function.prototype : this.handleClick(optionValue)
          }
        >
          {label}
        </Option>
      );
    });
  }

  render() {
    const {
      value,
      options,
      placeholder,
      isCancellable,
      boxOffset = DEFAULT_TOP_OFFSET,
      boxDirection = BOX_DIRECTION_DOWN,
      ...props
    } = this.props;
    const { isOpened } = this.state;

    const selectedLabel = value
      ? (options.find(({ value: optionValue }) => optionValue === value) || {})
          .label
      : placeholder;

    const topOffset =
      boxDirection === BOX_DIRECTION_DOWN
        ? boxOffset
        : (options.length + 1) * DEFAULT_OPTION_SIZE * -1;

    return (
      <Wrapper>
        <SelectedOption onClick={this.handleClickToggle} {...props}>
          <ValueText>
            {selectedLabel}
            {isCancellable && selectedLabel && (
              <IconCloseStyled
                name="close"
                width={12}
                height={12}
                onClick={this.handleClickCancel}
              />
            )}
          </ValueText>
          <ArrowIcon
            name="arrow-triangle"
            width={16}
            height={16}
            isOpened={isOpened}
          />
        </SelectedOption>
        {isOpened && (
          <Box top={topOffset}>
            <OptionsList>{this.renderOptions()}</OptionsList>
          </Box>
        )}
      </Wrapper>
    );
  }
}

SelectInner.ValueText = ValueText;
SelectInner.SelectedOption = SelectedOption;

export const Select = enhanceWithClickOutside(SelectInner);
