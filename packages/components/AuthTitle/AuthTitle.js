import styled from 'styled-components';

const AuthTitle = styled.h1`
  margin-top: 20px;
  margin-bottom: 8px;
  font-size: 36px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.black};
  text-align: center;
`;

export default AuthTitle;
