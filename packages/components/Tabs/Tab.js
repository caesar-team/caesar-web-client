import React from 'react';
import styled from 'styled-components';

const getTabStyles = ({ isActive, theme }) => {
  if (isActive) {
    return `
      background: ${theme.white};
    `;
  }

  return `
    background: transparent;
  `;
};

const StyledTab = styled.li`
  background-color: ${({ theme }) => theme.white};
  display: inline-block;
  outline: 0;
  margin-bottom: -1px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 3px;
  background: ${({ isActive, theme }) =>
    isActive ? theme.white : 'transparent'};

  &:not(:first-child) {
    border-left: none;
  }
`;

const Tab = ({ title, component, disabled, isActive, onClick }) => {
  const handleClick = () => {
    if (disabled) return;

    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledTab onClick={handleClick} isActive={isActive} disabled={disabled}>
      {component || title}
    </StyledTab>
  );
};

export default Tab;
