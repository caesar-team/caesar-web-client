import styled from 'styled-components';
import { Input } from '../Input';

const FormInput = styled(Input)`
  ${Input.InputField} {
    position: relative;
    padding: 5px 15px;
    color: ${({ theme }) => theme.black};
  }
`;

export default FormInput;
