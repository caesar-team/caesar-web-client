import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { useMedia } from '@caesar/common/hooks';
import { IS_AUTHORIZATION_ENABLE, ROUTES } from '@caesar/common/constants';
import { media } from '@caesar/assets/styles/media';
import { Logo } from './Logo';
import { Button } from '../Button';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  ${media.wideMobile`
    padding: 0 24px 8px;
    border-bottom: 1px solid ${({ theme }) => theme.color.lighterGray};
  `}
`;

const SecondaryHeader = ({
  router,
  buttonText = 'Sign In',
  url = IS_AUTHORIZATION_ENABLE ? ROUTES.SIGN_IN : ROUTES.MAIN,
  isButtonShow = IS_AUTHORIZATION_ENABLE,
}) => {
  const { isDesktop, isWideDesktop } = useMedia();
  const isNotMobile = isDesktop || isWideDesktop;

  return (
    <Wrapper>
      {isNotMobile
        ? <Logo href={url} width={142} height={40} />
        : <Logo href={url} width={114} height={32} />
      }
      {isButtonShow && (
        <Button
          isHigh={isNotMobile}
          isUppercase
          onClick={() => router.push(url)}
        >
          {buttonText}
        </Button>
      )}
    </Wrapper>
  );
};

export default withRouter(SecondaryHeader);
