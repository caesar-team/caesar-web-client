import React from 'react';
import styled from 'styled-components';
import { Input } from './Input';

const StyledInput = styled(Input)`
  ${Input.InputField} {
    padding-top: 0;
    padding-bottom: 0;
    font-size: ${({ theme }) => theme.font.size.big};
    line-height: ${({ theme }) => theme.font.lineHeight.big};
    background-color: ${({ theme }) => theme.color.white};
  }
`;

export const Title = props => <StyledInput {...props} />;
