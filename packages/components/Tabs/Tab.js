import React from 'react';
import styled from 'styled-components';

const getTabStyles = ({ isActive, theme }) => {
  if (isActive) {
    return `
      background: ${theme.color.white};
    `;
  }

  return `
    background: transparent;
  `;
};

const StyledTab = styled.li`
  display: inline-block;
  outline: 0;
  margin-bottom: -1px;
  margin-right: 30px;
  padding: 0 10px 4px;
  cursor: pointer;
  border-bottom: 1px solid ${({ isActive, theme }) =>
    isActive ? theme.color.black : 'transparent'};
  fonts-size: ${({ theme }) => theme.font.size.main};
  color: ${({ isActive, theme }) =>
    isActive ? theme.color.black : theme.color.emperor};  
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
