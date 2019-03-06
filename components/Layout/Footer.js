import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const FourXXIText = styled.div`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
  margin-left: 10px;
`;

const FourXXILink = styled.a`
  text-decoration: underline;
  font-weight: 600;
  color: ${({ theme }) => theme.black};
`;

const Footer = (
  <Fragment>
    <Icon name="logo-4xxi" width={20} height={20} />
    <FourXXIText>
      Created and supported by{' '}
      <FourXXILink href="https://4xxi.com/en">4xxi team</FourXXILink>
    </FourXXIText>
  </Fragment>
);

export default Footer;
