import React from 'react';
import styled from 'styled-components';
import BgRightImg from '@caesar/assets/images/bg-right.jpg';

import BgRightImg2x from '@caesar/assets/images/bg-right@2x.jpg';
import BgLeftImg from '@caesar/assets/images/bg-left.jpg';
import BgLeftImg2x from '@caesar/assets/images/bg-left@2x.jpg';
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

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  width: 100%;
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
    <InnerWrapper>
      {children}
    </InnerWrapper>
  </AuthLayout>
);

export default BootstrapWrapper;
