import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { IS_AUTHORIZATION_ENABLE, ROUTES } from '@caesar/common/constants';
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
  isButtonShow = IS_AUTHORIZATION_ENABLE,
}) => {
  const { isMobile } = useMedia();

  return (
    <Wrapper>
      <Logo href={ROUTES.MAIN} />
      {isButtonShow && (
        <>
          {isMobile ? (
            <StyledButton
              onClick={() => router.push(ROUTES.SIGN_IN)}
              icon="login"
              color="white"
            />
          ) : (
            <StyledButton
              onClick={() => router.push(ROUTES.SIGN_IN)}
              color="white"
            >
              Log In
            </StyledButton>
          )}
          <Button onClick={() => router.push(ROUTES.SIGN_UP)}>Sign Up</Button>
        </>
      )}
    </Wrapper>
  );
};

export const SecureHeader = withRouter(SecureHeaderComponent);
