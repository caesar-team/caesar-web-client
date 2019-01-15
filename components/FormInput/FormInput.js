import styled from 'styled-components';
import { Input } from '../Input';

const FormInput = styled(Input)`
  ${Input.InputField} {
    padding: 0 15px 10px;
    color: ${({ theme }) => theme.black};
    border-bottom: 1px solid ${({ theme }) => theme.gallery};
  }
`;

export default FormInput;
