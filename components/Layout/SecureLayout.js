import React, { Fragment } from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';
import { Icon } from '../Icon';
import { Button } from '../Button';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    margin-bottom: 100px;
  }

  ${LayoutConstructor.MainWrapper} {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
`;

const IconWrapper = styled.div`
  display: flex;
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  letter-spacing: 0.6px;
  padding: 18px 30px;
  height: 60px;
`;

const renderHeaderComponent = props => (
  <Fragment>
    <IconWrapper>
      <Icon name="logo-new" height={40} width={142} />
    </IconWrapper>
    <StyledButton onClick={() => props.router.push('/signin')}>
      Sign In
    </StyledButton>
  </Fragment>
);

const SecureLayout = props => (
  <LayoutConstructorStyled
    headerComponent={renderHeaderComponent(props)}
    footerComponent={Footer}
    {...props}
  />
);

export default withRouter(SecureLayout);
