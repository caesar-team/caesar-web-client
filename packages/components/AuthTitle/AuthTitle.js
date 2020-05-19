import styled from 'styled-components';

const AuthTitle = styled.h1`
  margin-top: 60px;
  margin-bottom: 8px;
  font-size: 36px;
  font-weight: 400;
  color: ${({ theme }) => theme.color.black};
  letter-spacing: 1px;
  text-align: center;
`;

export default AuthTitle;
