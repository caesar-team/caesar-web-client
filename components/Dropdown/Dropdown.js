import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 100;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.gallery};
`;

const Option = styled.div`
  padding: 10px 30px;
`;

class Dropdown extends Component {
  state = {
    isOpen: false,
  };

  handleClick = value => () => {
    const { name, onClick } = this.props;

    if (onClick) onClick(name, value);
  };

  handleToggle = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  renderOptions() {
    const { options } = this.props;

    return options.map(({ label, value }, index) => (
      <Option key={index} onClick={this.handleClick(value)}>
        {label}
      </Option>
    ));
  }

  render() {
    const { isOpen } = this.state;
    const { children, options, overlay, className } = this.props;

    const renderedOptions = options ? this.renderOptions() : overlay;

    return (
      <Wrapper>
        <div className={className} onMouseEnter={this.handleToggle}>
          {children}
        </div>
        {isOpen && (
          <Box onMouseLeave={this.handleToggle}>{renderedOptions}</Box>
        )}
      </Wrapper>
    );
  }
}

export default Dropdown;
