import React, { Fragment } from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { IS_AUTHORIZATION_ENABLE, ROUTES } from '@caesar/common/constants';
import { Logo } from './Logo';
import { Button } from '../Button';

const StyledButton = styled(Button)`
  font-size: 18px;
  padding: 18px 30px;
  height: 60px;
`;

const SecondaryHeader = ({
  router,
  buttonText = 'Sign In',
  url = IS_AUTHORIZATION_ENABLE ? ROUTES.SIGN_IN : ROUTES.MAIN,
  isButtonShow = IS_AUTHORIZATION_ENABLE,
}) => (
  <Fragment>
    <Logo href={url} width={142} height={40} />
    {isButtonShow && (
      <StyledButton onClick={() => router.push(url)}>{buttonText}</StyledButton>
    )}
  </Fragment>
);

export default withRouter(SecondaryHeader);
