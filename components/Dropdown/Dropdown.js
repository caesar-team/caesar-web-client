import React, { Component, cloneElement } from 'react';
import styled from 'styled-components';
import enhanceWithClickOutside from 'react-click-outside';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Box = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 100%;
  right: 0;
  z-index: 100;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.gallery};
`;

const Option = styled.button`
  padding: 10px 30px;
  border: none;
  background: none;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  outline: none;
`;

class DropdownInner extends Component {
  state = {
    isOpen: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const { onToggle } = this.props;
    if (prevState.isOpen !== this.state.isOpen && onToggle) {
      onToggle(this.state.isOpen);
    }
  }

  handleClick = value => () => {
    const { name, onClick } = this.props;
    this.handleToggle();

    if (onClick) onClick(name, value);
  };

  handleToggle = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  handleClickOutside() {
    this.setState({
      isOpen: false,
    });
  }

  renderOptions() {
    const { options, optionRender } = this.props;

    return options.map(
      ({ label, value }, index) =>
        optionRender ? (
          cloneElement(optionRender(value, label), {
            key: index,
            onClick: this.handleClick(value),
          })
        ) : (
          <Option key={index} onClick={this.handleClick(value)}>
            {label}
          </Option>
        ),
    );
  }

  render() {
    const { isOpen } = this.state;
    const { children, options, overlay, className } = this.props;

    const renderedOptions = options ? this.renderOptions() : overlay;

    return (
      <Wrapper>
        <Button type="button" className={className} onClick={this.handleToggle}>
          {children}
        </Button>
        {isOpen && <Box>{renderedOptions}</Box>}
      </Wrapper>
    );
  }
}

export const Dropdown = enhanceWithClickOutside(DropdownInner);
