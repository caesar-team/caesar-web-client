import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 60px;
  background-color: ${({ theme }) => theme.color.white};
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

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: 40px;
`;

const LayoutConstructor = ({
  headerComponent,
  footerComponent,
  children,
  className,
}) => (
  <Wrapper className={className}>
    {headerComponent && <TopWrapper>{headerComponent}</TopWrapper>}
    <MainWrapper>{children}</MainWrapper>
    {footerComponent && <BottomWrapper>{footerComponent}</BottomWrapper>}
  </Wrapper>
);

LayoutConstructor.TopWrapper = TopWrapper;
LayoutConstructor.MainWrapper = MainWrapper;
LayoutConstructor.BottomWrapper = BottomWrapper;

export default LayoutConstructor;
