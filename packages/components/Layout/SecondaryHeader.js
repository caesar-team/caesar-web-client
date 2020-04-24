import React, { Fragment } from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { Logo } from './Logo';
import { Button } from '../Button';
import { AUTHORIZATION_ENABLE } from '@caesar/common/constants';

const StyledButton = styled(Button)`
  font-size: 18px;
  letter-spacing: 0.6px;
  padding: 18px 30px;
  height: 60px;
`;

const SecondaryHeader = ({
  router,
  buttonText = 'Sign In',
  url = '/signin',
}) => (
  <Fragment>
    <Logo href={url} width={142} height={40} />
    {AUTHORIZATION_ENABLE &&
      <StyledButton onClick={() => router.push(url)}>{buttonText}</StyledButton>
    }
  </Fragment>
);

export default withRouter(SecondaryHeader);
