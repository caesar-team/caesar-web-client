import React from 'react';
import styled from 'styled-components';
import { LogoCaesarDomain, Button } from '@caesar-ui';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.emperor};
  width: 100%;
  height: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 282px;
`;

const ButtonStyled = styled(Button)`
  font-size: 18px;
  padding: 18px 30px;
  height: 60px;
  margin-top: 40px;
  color: ${({ theme }) => theme.color.emperor};
`;

const Login = () => (
  <Wrapper>
    <InnerWrapper>
      <LogoCaesarDomain color="white" width={146} height={45} />
      <ButtonStyled
        color="white"
        onClick={() => chrome.tabs.create({ url: process.env.APP_URI })}
      >
        Login
      </ButtonStyled>
    </InnerWrapper>
  </Wrapper>
);

export default Login;
