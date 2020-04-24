import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';
import SecondaryHeader from './SecondaryHeader';

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

const SecureLayout = props => (
  <LayoutConstructorStyled
    headerComponent={<SecondaryHeader />}
    footerComponent={Footer}
    {...props}
  />
);

export default SecureLayout;
