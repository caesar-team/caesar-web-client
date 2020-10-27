import styled from 'styled-components';
import { Icon, Button } from '@caesar/components';
import { media } from '@caesar/assets/styles/media';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.color.emperor};
`;

export const Header = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.lighterGray};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 24px 16px;
`;

export const Title = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.lightGray};
  margin-bottom: 23px;
`;

export const StyledLogo = styled(Icon)`
  fill: ${({ theme }) => theme.color.white};
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 24px;
  margin-top: 24px;
  margin-bottom: 24px;

  ${media.mobile`
    flex-direction: column;
    width: 100%;
  `}
`;

export const ButtonStyled = styled(Button)`
  ${media.mobile`
    width: 100%;
  `}

  &:not(:first-child) {
    margin-left: 24px;

    ${media.mobile`
    margin-left: 0;
    margin-top: 24px;
  `}
  }
`;

export const Footer = styled.div``;

export const StyledLink = styled.a`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.white};
  text-decoration: none;
`;
