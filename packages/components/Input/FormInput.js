import styled from 'styled-components';
import { Input } from './Input';

export const FormInput = styled(Input)`
  ${Input.InputField} {
    position: relative;
    padding: 4px 16px;
    color: ${({ theme }) => theme.color.black};
  }
`;
