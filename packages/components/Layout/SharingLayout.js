import React from 'react';
import styled from 'styled-components';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';
import { LogoCaesarDomain } from '../LogoCaesarDomain';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;

  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
    margin-bottom: 10px;
    padding: 20px;
  }

  ${LayoutConstructor.MainWrapper} {
    width: 100%;
    max-width: 848px;
    padding: 24px;
    margin: 0 auto;
  }

  ${LayoutConstructor.BottomWrapper} {
    margin-bottom: 20px;
  }
`;

const SharingLayout = props => (
  <LayoutConstructorStyled
    headerComponent={<LogoCaesarDomain width={97} height={30} />}
    footerComponent={Footer}
    {...props}
  />
);

export default SharingLayout;
