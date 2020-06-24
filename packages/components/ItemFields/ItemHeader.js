import React from 'react';
import styled from 'styled-components';
import { Button } from '../Button';

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 8px 24px;
  background-color: ${({ theme }) => theme.color.alto};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
`;

const PathButton = styled(Button)`
  margin-right: auto;
  font-size: ${({ theme }) => theme.font.size.main};
  text-transform: initial;
`;

const Delimeter = styled.span`
  margin: 0 16px;
`;

export const ItemHeader = ({ item }) => {
  return (
    <ColumnHeader>
      <PathButton
        color="white"
        onClick={() => {
          console.log('Change path');
        }}
      >
        Personal
        <Delimeter>|</Delimeter>
        Passwords
      </PathButton>
    </ColumnHeader>
  );
};
