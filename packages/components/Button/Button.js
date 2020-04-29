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
      background-color: ${theme.color.white};
      border: 1px solid ${theme.color.black};
    `,
  };

  return colorsMap[color];
};

const getButtonHoverBlackBackgroundStyles = ({ color, theme }) => {
  const colorsMap = {
    white: `
      color: ${theme.color.white};
      background-color: ${theme.color.black};
      border: 1px solid ${theme.color.black};
    `,
  };

  return colorsMap[color];
};

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ isHigh }) => (isHigh ? '60px' : '40px')};
  padding: ${({ isHigh }) => (isHigh ? '18px 30px' : '10px 20px')};
  font-size: ${({ isHigh }) => (isHigh ? '18px' : '14px')};
  letter-spacing: ${({ isHigh }) => (isHigh ? '0.6px' : '0.4px')};
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
    ${({ isHoverBlackBackground }) =>
      isHoverBlackBackground
        ? getButtonHoverBlackBackgroundStyles
        : getButtonHoverStyles};
  }

  &[disabled] {
    background-color: ${({ theme }) => theme.color.gallery};
    cursor: not-allowed;
  }
`;

const Text = styled.div`
  margin-left: ${({ withMargin }) => (withMargin ? '10px' : 0)};
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
      isHoverBlackBackground,
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
        isHoverBlackBackground={isHoverBlackBackground}
        type={htmlType}
        color={color}
        onlyIcon={onlyIcon}
        disabled={isDisabled}
        isHigh={isHigh}
        {...props}
      >
        {icon && <Icon name={icon} width={14} height={14} isInButton />}
        {!onlyIcon && <Text withMargin={withIcon}>{children}</Text>}
      </StyledButton>
    );
  },
);

export const Button = withOfflineDetection(ButtonComponent);
