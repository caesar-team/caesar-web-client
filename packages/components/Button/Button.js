import React, { forwardRef } from 'react';
import styled from 'styled-components';
import withOfflineDetection from '../Offline/withOfflineDetection';
import Icon from '../Icon/Icon';

const getButtonStyles = ({ color, theme }) => {
  const colorsMap = {
    black: `
      color: ${theme.color.white};
      background-color: ${theme.color.black};
    `,
    white: `
      background-color: ${theme.color.white};
      color: ${theme.color.emperor};
      border: 1px solid ${theme.color.gallery};
    `,
    transparent: `
      height: 22px;
      padding: 0;
      color: ${theme.color.black};
      text-transform: none;
      background-color: transparent;
    `,
  };

  return colorsMap[color];
};

const getButtonHoverStyles = ({ color, theme }) => {
  const colorsMap = {
    black: `
      background-color: ${theme.color.emperor};
    `,
    white: `
      color: ${theme.color.black};
      border: 1px solid ${theme.color.black};
    `,
    transparent: `
      color: ${theme.color.gray};
      text-transform: none;
    `,
  };

  return colorsMap[color];
};

const getButtonPressedStyles = ({ color, theme }) => {
  const colorsMap = {
    black: `
      background-color: ${theme.color.gray};
    `,
    white: `
      color: ${theme.color.emperor};
      border: 1px solid ${theme.color.gray};
    `,
    transparent: `
      color: ${theme.color.emperor};
      text-transform: none;
    `,
  };

  return colorsMap[color];
};

const getButtonDisabledStyles = ({ color, theme }) => {
  const colorsMap = {
    black: `
      background-color: ${theme.color.gallery};
    `,
    white: `
      color: ${theme.color.gallery};
      border: 1px solid ${theme.color.gallery};
    `,
    transparent: `
      color: ${theme.color.lightGray};
      text-transform: none;
    `,
  };

  return colorsMap[color];
};

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ isHigh }) => (isHigh ? '60px' : '40px')};
  padding: ${({ isHigh }) => (isHigh ? '18px 30px' : '11px 16px')};
  font-size: ${({ isHigh }) => (isHigh ? '18px' : '14px')};
  letter-spacing: ${({ isHigh }) => (isHigh ? '0.6px' : '0.4px')};
  white-space: nowrap;
  border-radius: 3px;
  border: 0;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;

  ${({ isHigh }) => !isHigh && `text-transform: uppercase;`}

  ${({ onlyIcon }) =>
    onlyIcon &&
    `
    width: 40px;
    padding: 0;
  `};

  ${getButtonStyles};

  &:hover {
    ${getButtonHoverStyles};
  }

  &:focus {
    outline: 1px dashed ${({ theme }) => theme.color.lightGray};
    outline-offset: 4px;
  }

  &:active {
    ${getButtonPressedStyles};
  }

  &[disabled] {
    ${getButtonDisabledStyles};
    pointer-events: none;
  }
`;

const Text = styled.div`
  margin-left: ${({ withMargin }) => (withMargin ? '16px' : 0)};
`;

const getButtonDisabledStatus = (withOfflineCheck, isOnline, disabled) =>
  (withOfflineCheck && !isOnline) || disabled;

const ButtonComponent = forwardRef(
  (
    {
      icon,
      color = 'black',
      htmlType = 'button',
      children,
      disabled,
      withOfflineCheck = false,
      isOnline,
      isHigh,
      ...props
    },
    ref,
  ) => {
    const onlyIcon = !children;
    const withIcon = !!icon;
    const isDisabled = getButtonDisabledStatus(
      withOfflineCheck,
      isOnline,
      disabled,
    );

    return (
      <StyledButton
        ref={ref}
        type={htmlType}
        color={color}
        onlyIcon={onlyIcon}
        disabled={isDisabled}
        isHigh={isHigh}
        {...props}
      >
        {icon && <Icon name={icon} width={16} height={16} />}
        {!onlyIcon && <Text withMargin={withIcon}>{children}</Text>}
      </StyledButton>
    );
  },
);

const Button = withOfflineDetection(ButtonComponent);

Button.Text = Text;

export { Button };
