import React, { Fragment } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';
import { Icon } from '../Icon';
import { Link } from '../Link';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;

  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    border-bottom: 1px solid ${({ theme }) => theme.gallery};
    margin-bottom: 10px;
    padding: 20px;
  }

  ${LayoutConstructor.MainWrapper} {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  ${LayoutConstructor.BottomWrapper} {
    margin-bottom: 20px;
  }
`;

const Header = () => (
  <Fragment>
    <Icon name="logo-new" width={106} height={30} />
    <Link onClick={() => Router.push('/logout')}>Logout</Link>
  </Fragment>
);

const SharingLayout = props => (
  <LayoutConstructorStyled
    withImages
    headerComponent={<Header />}
    footerComponent={Footer}
    {...props}
  />
);

export default SharingLayout;
