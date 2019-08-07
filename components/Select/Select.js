import React, { Component } from 'react';
import styled from 'styled-components';
import enhanceWithClickOutside from 'react-click-outside';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SelectedOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  padding: 5px 15px;
  cursor: pointer;
`;

const ValueText = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  position: relative;
  width: 100%;
`;

const IconCloseStyled = styled(Icon)`
  position: absolute;
  right: 20px;
`;

const Box = styled.div`
  position: absolute;
  z-index: 11;
  top: 48px;
  width: 100%;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid ${({ theme }) => theme.gallery};
  border-radius: 3px;
  width: 100%;
`;

const Option = styled.div`
  display: flex;
  padding: 10px 15px;
  font-size: 16px;
  letter-spacing: 0.5px;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.lightGray : theme.emperor};
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.snow : theme.white};
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};

  &:hover {
    color: ${({ theme, isDisabled }) =>
      isDisabled ? theme.lightGray : theme.black};
  }
`;

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
    const { value, options, placeholder, isCancellable, ...props } = this.props;
    const { isOpened } = this.state;

    const iconName = isOpened ? 'arrow-up-big' : 'arrow-down-big';
    const selectedLabel = value
      ? (options.find(({ value: optionValue }) => optionValue === value) || {})
          .label
      : placeholder;

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
          <Icon name={iconName} width={16} height={16} />
        </SelectedOption>
        {isOpened && (
          <Box>
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
