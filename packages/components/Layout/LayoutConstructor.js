import React from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 60px 30px;
  background-color: ${({ theme }) => theme.color.white};
  flex: 1;
  overflow: auto;
  min-height: 100vh;
  height: 100%;

  ${({ withImages }) =>
    withImages &&
    `
    background-image: url('/images/secure-bg-right.png'),
      url('/images/secure-bg-btn.png');
    background-size: 217px 300px, 279px 200px;
    background-position: calc(100% - 60px) 150px, 60px 550px;
    background-repeat: no-repeat, no-repeat;
    
    @media (min-resolution: 144dpi) and (min-resolution: 1.5dppx) {
      background-image: url('/images/secure-bg-right@2x.png'),
        url('/images/secure-bg-btn@2x.png');
    }
  
    @media (min-resolution: 288dpi) and (min-resolution: 3.0dppx) {
      background-image: url('/images/secure-bg-right@3x.png'),
        url('/images/secure-bg-btn@3x.png');
    }
    
    ${media.desktop`
      background-position: calc(100% - 30px) 150px, 30px 410px;
    `}
  
    ${media.wideMobile`
        background-position: calc(100% - 30px) 130px, 30px 380px;
    `}

    ${media.mobile`
      background-position: calc(100% + 40px) 85px, -90px 290px;
    `}      
  `};
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const MainWrapper = styled.div`
  flex: 1;
  width: 100%;
`;

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: 40px;
`;

const LayoutConstructor = ({
  withImages = false,
  headerComponent,
  footerComponent,
  children,
  className,
}) => (
  <Wrapper className={className} withImages={withImages}>
    {headerComponent && <TopWrapper>{headerComponent}</TopWrapper>}
    <MainWrapper>{children}</MainWrapper>
    {footerComponent && <BottomWrapper>{footerComponent}</BottomWrapper>}
  </Wrapper>
);

LayoutConstructor.TopWrapper = TopWrapper;
LayoutConstructor.MainWrapper = MainWrapper;
LayoutConstructor.BottomWrapper = BottomWrapper;

export default LayoutConstructor;
