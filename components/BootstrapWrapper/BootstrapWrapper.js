import React from 'react';
import styled from 'styled-components';
import BgRightImg from 'static/images/bg-right.jpg';
import BgRightImg2x from 'static/images/bg-right@2x.jpg';
import BgLeftImg from 'static/images/bg-left.jpg';
import BgLeftImg2x from 'static/images/bg-left@2x.jpg';
import { AuthLayout } from '../Layout';

const BgRightImage = styled.img`
  position: absolute;
  right: 60px;
  object-fit: contain;
`;

const BgLeftImage = styled.img`
  position: absolute;
  left: 60px;
  bottom: 90px;
  object-fit: contain;
`;

const BootstrapWrapper = ({ children }) => (
  <AuthLayout>
    <BgRightImage
      src={BgRightImg}
      srcSet={`${BgRightImg} 1x, ${BgRightImg2x} 2x`}
    />
    <BgLeftImage
      src={BgRightImg}
      srcSet={`${BgLeftImg} 1x, ${BgLeftImg2x} 2x`}
    />
    {children}
  </AuthLayout>
);

export default BootstrapWrapper;
