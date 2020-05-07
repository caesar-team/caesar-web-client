import React from 'react';
import styled from 'styled-components';
import { Icon, Button } from '@caesar-ui';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.emperor};
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

const StyledLogo = styled(Icon)`
  fill: ${({ theme }) => theme.white};
`;

const ButtonStyled = styled(Button)`
  font-size: 18px;
  letter-spacing: 0.6px;
  padding: 18px 30px;
  height: 60px;
  margin-top: 40px;
  color: ${({ theme }) => theme.emperor};
`;

const Login = () => {
  return (
    <Wrapper>
      <InnerWrapper>
        <StyledLogo name="logo-new" width={210} height={45} />
        <ButtonStyled
          color="white"
          onClick={() => chrome.tabs.create({ url: process.env.APP_URI })}
        >
          Login
        </ButtonStyled>
      </InnerWrapper>
    </Wrapper>
  );
};

export default Login;
