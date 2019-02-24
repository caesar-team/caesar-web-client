import React from 'react';
import styled from 'styled-components';

const getTabColor = (isActive, disabled, theme) => {
  if (disabled) {
    return theme.greyjoy;
  }

  if (isActive) {
    return theme.baratheon;
  }

  return theme.stark;
};

const StyledTab = styled.li`
  background-color: #fff;
  border: 1px solid #e6e1e2;
  border-bottom: ${({ isActive }) =>
    isActive ? '1px solid #fff' : '1px solid #e6e1e2'};
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.6px;
  line-height: 1.5;
  color: ${({ isActive, disabled, theme }) =>
    getTabColor(isActive, disabled, theme)};
  outline: 0;
  padding: 16px 20px;
  margin-bottom: -2px;
  cursor: pointer;

  &:not(:first-child) {
    border-left: none;
  }
`;

const Tab = ({ title, disabled, isActive, onClick }) => {
  const handleClick = () => {
    if (disabled) return;

    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledTab onClick={handleClick} isActive={isActive} disabled={disabled}>
      {title}
    </StyledTab>
  );
};

export default Tab;
