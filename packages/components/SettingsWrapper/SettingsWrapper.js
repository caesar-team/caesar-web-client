import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { LogoLoader } from '../Loader';

const LogoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 55px);
  background: ${({ theme }) => theme.color.alto};
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.alto};
  width: 100%;
  padding: 40px;
`;

const TopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.div`
  margin-right: auto;
  font-size: ${({ theme }) => theme.font.size.large};
  color: ${({ theme }) => theme.color.black};
`;

export const SettingsWrapper = forwardRef(
  ({ isLoading, title, addonTopComponent, children }, ref) => {
    if (isLoading) {
      return (
        <LogoWrapper>
          <LogoLoader textColor="black" />
        </LogoWrapper>
      );
    }

    return (
      <Wrapper ref={ref}>
        <TopWrapper>
          <Title>{title}</Title>
          {addonTopComponent}
        </TopWrapper>
        {children}
      </Wrapper>
    );
  },
);
