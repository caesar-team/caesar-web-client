import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { IS_AUTHORIZATION_ENABLE } from '@caesar/common/constants';
import { useMedia } from '@caesar/common/hooks';
import { Logo } from './Logo';
import { Button } from '../Button';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
`;

const StyledButton = styled(Button)`
  margin-right: 20px;
  margin-left: auto;
`;

const SecureHeaderComponent = ({
  router,
  url = IS_AUTHORIZATION_ENABLE ? '/signin' : '/',
  isButtonShow = IS_AUTHORIZATION_ENABLE,
}) => {
  const { isMobile } = useMedia();

  return (
    <Wrapper>
      <Logo
        href={url}
        width={isMobile ? 25 : 107}
        height={30}
        iconName={isMobile ? 'caesar' : 'logo-new'}
      />
      {isButtonShow && (
        <>
          {isMobile ? (
            <StyledButton onClick={() => router.push('/signin')} icon="login" />
          ) : (
            <StyledButton onClick={() => router.push('/signin')}>
              Log In
            </StyledButton>
          )}
          <Button onClick={() => router.push('/signup')}>Sign Up</Button>
        </>
      )}
    </Wrapper>
  );
};

export const SecureHeader = withRouter(SecureHeaderComponent);
