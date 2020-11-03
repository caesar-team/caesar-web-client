import React from 'react';
import styled from 'styled-components';

const StyledTab = styled.li`
  display: inline-block;
  outline: 0;
  margin-bottom: -1px;
  margin-right: 32px;
  padding: 0 12px 4px;
  cursor: pointer;
  border-bottom: 1px solid
    ${({ isActive, theme }) => (isActive ? theme.color.black : 'transparent')};
  font-size: ${({ theme }) => theme.font.size.main};
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
