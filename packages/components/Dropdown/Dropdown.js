import React, { cloneElement, memo, useState, useRef } from 'react';
import { useUpdateEffect, useClickAway } from 'react-use';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Box = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: ${({ withTriangleAtTop }) =>
    withTriangleAtTop ? 'calc(100% + 19px)' : 'calc(100% - 1px)'};
  right: 0;
  z-index: 100;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gallery};

  &::before {
    position: absolute;
    z-index: 1;
    display: ${({ withTriangleAtTop }) =>
      withTriangleAtTop ? 'block' : 'none'};
    width: 15px;
    height: 15px;
    right: 10px;
    top: -7px;
    content: '';
    transform: rotate(45deg);
    background-color: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.gallery};
  }
`;

const OptionsList = styled.div`
  position: relative;
  z-index: 2;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 3px;
  overflow: hidden;
`;

const Option = styled.button`
  padding: 10px 30px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
  }
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  outline: none;
  padding: 0;
  cursor: pointer;
`;

const DropdownComponent = ({
  withTriangleAtTop,
  ButtonElement,
  name,
  renderOverlay = Function.prototype,
  options,
  optionRender,
  children,
  onClick,
  onToggle,
  className,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleToggle = () => {
    setIsOpened(!isOpened);
  };

  const handleClick = value => () => {
    handleToggle();

    if (onClick) onClick(name, value);
  };

  const renderOptions = () => {
    return options.map(({ label, value }, index) =>
      optionRender ? (
        cloneElement(optionRender(value, label), {
          key: index,
          onClick: handleClick(value),
        })
      ) : (
        <Option key={index} onClick={handleClick(value)}>
          {label}
        </Option>
      ),
    );
  };

  useUpdateEffect(() => {
    if (onToggle) {
      onToggle(isOpened);
    }
  }, [isOpened]);

  const renderedOptions = options
    ? renderOptions()
    : renderOverlay(handleToggle);

  const dropdownRef = useRef(null);
  useClickAway(dropdownRef, () => {
    setIsOpened(false);
  });

  return (
    <Wrapper ref={dropdownRef}>
      {ButtonElement ? (
        <ButtonElement handleToggle={handleToggle} />
      ) : (
        <Button type="button" className={className} onClick={handleToggle}>
          {children}
        </Button>
      )}
      {isOpened && (
        <Box withTriangleAtTop={withTriangleAtTop}>
          <OptionsList>{renderedOptions}</OptionsList>
        </Box>
      )}
    </Wrapper>
  );
};

const Dropdown = memo(DropdownComponent);
Dropdown.Box = Box;
export { Dropdown };
