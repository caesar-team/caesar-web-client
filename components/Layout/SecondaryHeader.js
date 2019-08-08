import React, { Fragment } from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { Icon } from '../Icon';
import { Button } from '../Button';

const IconWrapper = styled.div`
  display: flex;
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  letter-spacing: 0.6px;
  padding: 18px 30px;
  height: 60px;
`;

const SecondaryHeader = props => (
  <Fragment>
    <IconWrapper>
      <Icon name="logo-new" height={40} width={142} />
    </IconWrapper>
    <StyledButton onClick={() => props.router.push('/signin')}>
      Sign In
    </StyledButton>
  </Fragment>
);

export default withRouter(SecondaryHeader);
