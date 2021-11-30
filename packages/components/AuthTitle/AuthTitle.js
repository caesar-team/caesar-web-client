import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';

const AuthTitle = styled.h1`
  margin-top: 40px;
  margin-bottom: 8px;
  font-size: ${({ theme }) => theme.font.size.large};
  font-weight: 400;
  color: ${({ theme }) => theme.color.black};
  text-align: center;
  
  ${media.wideMobile`
    font-size: ${({ theme }) => theme.font.size.big};
  `}    
`;

export default AuthTitle;
