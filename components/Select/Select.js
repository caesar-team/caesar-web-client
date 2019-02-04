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
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
`;

const Box = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.gallery};
  border-radius: 3px;
  z-index: 11;
  top: 48px;
  width: 100%;
`;

const Option = styled.div`
  display: flex;
  padding: 10px 15px;
  font-size: 16px;
  letter-spacing: 0.5px;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: ${({ theme }) => theme.emperor};
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.snow : theme.white};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.black};
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
    const { name, onChange } = this.props;

    this.setState(
      {
        isOpened: false,
      },
      () => {
        if (onChange) {
          onChange(name, value);
        }
      },
    );
  };

  handleClickOutside() {
    this.setState({
      isOpened: false,
    });
  }

  renderOptions() {
    const { value, options } = this.props;

    return options.map(({ value: optionValue, label }) => {
      const isActive = value === optionValue;

      return (
        <Option
          key={optionValue}
          isActive={isActive}
          onClick={this.handleClick(optionValue)}
        >
          {label}
        </Option>
      );
    });
  }

  render() {
    const { value, options, placeholder } = this.props;
    const { isOpened } = this.state;

    const iconName = isOpened ? 'arrow-up-big' : 'arrow-down-big';
    const selectedLabel = value
      ? options.find(({ value: optionValue }) => optionValue === value).label
      : placeholder;

    return (
      <Wrapper>
        <SelectedOption onClick={this.handleClickToggle}>
          <ValueText>{selectedLabel}</ValueText>
          <Icon name={iconName} width={16} height={16} />
        </SelectedOption>
        {isOpened && <Box>{this.renderOptions()}</Box>}
      </Wrapper>
    );
  }
}

export const Select = enhanceWithClickOutside(SelectInner);
