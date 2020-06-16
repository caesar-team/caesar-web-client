import React, { Fragment } from 'react';
import styled from 'styled-components';
import BgRightImg from '@caesar/assets/images/bg-right.jpg';
import BgRightImg2x from '@caesar/assets/images/bg-right@2x.jpg';
import BgLeftImg from '@caesar/assets/images/bg-left.jpg';
import BgLeftImg2x from '@caesar/assets/images/bg-left@2x.jpg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 60px 30px;
  background: ${({ theme }) => theme.color.white};
  flex: 1;
  overflow: auto;
  min-height: 100vh;
  height: 100%;
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

const BgRightImage = styled.img`
  position: absolute;
  right: 60px;
  top: 180px;
  object-fit: contain;
`;

const BgLeftImage = styled.img`
  position: absolute;
  left: 60px;
  bottom: 90px;
  object-fit: contain;
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
  <Wrapper className={className}>
    {withImages && (
      <Fragment>
        <BgRightImage
          src={BgRightImg}
          srcSet={`${BgRightImg} 1x, ${BgRightImg2x} 2x`}
        />
        <BgLeftImage
          src={BgRightImg}
          srcSet={`${BgLeftImg} 1x, ${BgLeftImg2x} 2x`}
        />
      </Fragment>
    )}
    {headerComponent && <TopWrapper>{headerComponent}</TopWrapper>}
    <MainWrapper>{children}</MainWrapper>
    {footerComponent && <BottomWrapper>{footerComponent}</BottomWrapper>}
  </Wrapper>
);

LayoutConstructor.TopWrapper = TopWrapper;
LayoutConstructor.MainWrapper = MainWrapper;
LayoutConstructor.BottomWrapper = BottomWrapper;

export default LayoutConstructor;
