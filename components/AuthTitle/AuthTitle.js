import styled from 'styled-components';

const AuthTitle = styled.h1`
  margin-top: 0;
  margin-bottom: 28px;
  font-size: 36px;
  font-weight: 400;
  color: ${({ theme }) => theme.black};
  letter-spacing: 1px;
  text-align: center;
`;

export default AuthTitle;
