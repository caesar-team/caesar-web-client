import React from 'react';
import styled from 'styled-components';
import BgRightImg from 'public/images/bg-right.jpg';
import BgRightImg2x from 'public/images/bg-right@2x.jpg';
import BgLeftImg from 'public/images/bg-left.jpg';
import BgLeftImg2x from 'public/images/bg-left@2x.jpg';
import { AuthLayout } from '../Layout';
import { Icon } from '../Icon';

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

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 30px;
`;

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
      <BottomWrapper>
        <Icon name="logo-4xxi" width={20} height={20} />
        <FourXXIText>
          Created and supported by{' '}
          <FourXXILink href="https://4xxi.com/en">4xxi team</FourXXILink>
        </FourXXIText>
      </BottomWrapper>
    </InnerWrapper>
  </AuthLayout>
);

export default BootstrapWrapper;
