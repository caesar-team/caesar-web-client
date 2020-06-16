import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { ROUTES } from '@caesar/common/constants';
import LayoutConstructor from './LayoutConstructor';
import Footer from './Footer';
import { Icon } from '../Icon';
import { Link } from '../Link';

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
    max-width: 800px;
    margin: 0 auto;
  }

  ${LayoutConstructor.BottomWrapper} {
    margin-bottom: 20px;
  }
`;

const Header = () => (
  <>
    <Icon name="logo-caesar-4xxi" width={106} height={30} />
    <Link href="/logout" onClick={() => Router.push(ROUTES.LOGOUT)}>
      Log out
    </Link>
  </>
);

const SharingLayout = props => (
  <LayoutConstructorStyled
    headerComponent={<Header />}
    footerComponent={Footer}
    {...props}
  />
);

export default SharingLayout;
