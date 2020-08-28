import styled from 'styled-components';
import { Icon } from '../Icon';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.snow};
  border: 1px dashed
    ${({ theme, isDragActive }) =>
      isDragActive ? theme.color.black : theme.color.gray};
  width: 100%;
  padding: 16px 5px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  outline: none;
  transition: all 0.2s;

  ${({ isDisabled }) => isDisabled && `opacity: 0.3;`}
`;
export const Text = styled.span`
  margin-bottom: 5px;
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.color.emperor};
`;
export const HintText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
`;
export const Link = styled.a`
  color: ${({ theme }) => theme.color.black};
`;
export const StyledIcon = styled(Icon)`
  fill: ${({ theme, isDragActive }) =>
    isDragActive ? theme.color.gray : theme.color.black};
  transition: all 0.2s;
  margin-right: 15px;
`;
export const Error = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.red};
`;
