import React from 'react';
import styled from 'styled-components';
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
      background-color: ${theme.white};
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

  ${({ onlyIcon }) =>
    onlyIcon &&
    `
    width: 40px;
    padding: 0;
  `};

  &[disabled] {
    opacity: 0.2;
    cursor: not-allowed;
  }

  ${getButtonStyles};

  &:hover {
    ${getButtonHoverStyles};
  }
`;

const Text = styled.div`
  margin-left: ${({ withMargin }) => (withMargin ? '10px' : 0)};
`;

const Button = ({
  icon,
  color = 'black',
  htmlType = 'button',
  children,
  ...props
}) => {
  const isBlack = color === 'black';
  const onlyIcon = !children;
  const withIcon = !!icon;

  return (
    <StyledButton type={htmlType} color={color} onlyIcon={onlyIcon} {...props}>
      {icon && (
        <Icon
          name={icon}
          width={14}
          height={14}
          fill={isBlack ? '#fff' : '#505050'}
        />
      )}
      {!onlyIcon && <Text withMargin={withIcon}>{children}</Text>}
    </StyledButton>
  );
};

export default Button;
