import React, { memo } from 'react';
import styled from 'styled-components';
import { Icon } from '../../Icon';

const AddButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.color.black};
  border: 1px solid ${({ theme }) => theme.color.black};
  border-radius: 50%;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.emperor};
    border-color: ${({ theme }) => theme.color.emperor};
  }
`;

const AddControlComponent = ({ onClick, className }) => {
  const handleClick = e => {
    e.stopPropagation();
    onClick();
  };

  return (
    <AddButton className={className} onClick={handleClick}>
      <Icon name="plus" color="white" width={14} height={14} />
    </AddButton>
  );
};

export const AddControl = memo(AddControlComponent);
