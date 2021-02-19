import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';

const AuthDescription = styled.div`
  margin-bottom: ${({ isCompact }) => (isCompact ? '20px' : '50px')};
  font-size: 18px;
  color: ${({ theme }) => theme.color.gray};
  text-align: center;

  ${media.wideMobile`
    font-size: ${({ theme }) => theme.font.size.main};
  `}
`;

export default AuthDescription;
