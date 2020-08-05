import React from 'react';
import styled from 'styled-components';
import { Button } from '../../Button';

const StyledButton = styled(Button)`
  margin-left: auto;
`;

export const RemoveButton = ({ onClick }) => {
  return (
    <StyledButton color="white" icon="trash" onClick={onClick}>
      Remove
    </StyledButton>
  );
};
