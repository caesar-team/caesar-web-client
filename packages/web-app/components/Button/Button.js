import React, { forwardRef } from 'react';
import styled from 'styled-components';
import withOfflineDetection from '../Offline/withOfflineDetection';
import Icon from '../Icon/Icon';

const getButtonStyles = ({ color, theme }) => {
  const colorsMap = {
    black: `
      color: ${theme.white};
      background-color: ${theme.black};
    `,
    white: `
      background-color: ${theme.white};
      color: ${theme.emperor};
      border: 1px solid ${theme.gallery};
    `,
  };

  return colorsMap[color];
};

const getButtonHoverStyles = ({ color, theme }) => {
  const colorsMap = {
    black: `
      background-color: ${theme.emperor};
    `,
    white: `
      color: ${theme.black};
      background-color: ${theme.white};
      border: 1px solid ${theme.black};
    `,
  };

  return colorsMap[color];
};

const getButtonHoverBlackBackgroundStyles = ({ color, theme }) => {
  const colorsMap = {
    white: `
      color: ${theme.white};
      background-color: ${theme.black};
      border: 1px solid ${theme.black};
    `,
  };

  return colorsMap[color];
};

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 14px;
  letter-spacing: 0.4px;
  border-radius: 3px;
  border: 0;
  outline: none;
  cursor: pointer;
  padding: 10px 20px;
  transition: all 0.2s;

  ${({ onlyIcon }) =>
    onlyIcon &&
    `
    width: 40px;
    padding: 0;
  `};

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${getButtonStyles};

  &:hover {
    ${({ isHoverBlackBackground }) =>
      isHoverBlackBackground
        ? getButtonHoverBlackBackgroundStyles
        : getButtonHoverStyles};
  }
`;

const Text = styled.div`
  margin-left: ${({ withMargin }) => (withMargin ? '10px' : 0)};
`;

const getButtonDisabledStatus = (withOfflineCheck, isOnline, disabled) =>
  (withOfflineCheck && !isOnline) || disabled;

const Button = forwardRef(
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
        {...props}
      >
        {icon && <Icon name={icon} width={14} height={14} isInButton />}
        {!onlyIcon && <Text withMargin={withIcon}>{children}</Text>}
      </StyledButton>
    );
  },
);

export default withOfflineDetection(Button);
