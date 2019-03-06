import React from 'react';
import styled from 'styled-components';
import { AuthTitle, AuthDescription, Button } from 'components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QrCodeImage = styled.img`
  display: inline-block;
  width: 200px;
  height: 200px;
  vertical-align: top;
  margin-bottom: 20px;
`;

const QrCodeKeyWrapper = styled.div`
  margin-top: -10px;
  margin-bottom: 20px;
  text-align: center;
`;

const QrCodeKey = styled.span`
  font-size: 36px;
  letter-spacing: 1px;
`;

const NextButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
  max-width: 400px;
`;

const TwoFactorCreateForm = ({ qr, code, onClickNext }) => (
  <Wrapper>
    <AuthTitle>Two Factor Authentication</AuthTitle>
    <AuthDescription>Scan the QR code above</AuthDescription>
    <QrCodeImage src={qr} />
    <AuthDescription>
      or manually enter the key in the application:
    </AuthDescription>
    <QrCodeKeyWrapper>
      <QrCodeKey>{code}</QrCodeKey>
    </QrCodeKeyWrapper>
    <NextButton onClick={onClickNext}>Next</NextButton>
  </Wrapper>
);

export default TwoFactorCreateForm;
