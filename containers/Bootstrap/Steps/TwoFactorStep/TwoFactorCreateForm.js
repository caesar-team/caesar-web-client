import React, { Component } from 'react';
import styled from 'styled-components';
import {
  WrapperAlignTop,
  AuthWrapper,
  AuthTitle,
  AuthDescription,
  Button,
} from 'components';

const InnerWrapper = styled.div`
  max-width: 400px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
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
`;

class TwoFactorCreateForm extends Component {
  render() {
    const { qr, code, onClickNext } = this.props;

    return (
      <WrapperAlignTop>
        <AuthWrapper>
          <AuthTitle>Two Factor Authentication</AuthTitle>
          <AuthDescription>Scan the QR code above</AuthDescription>
          <InnerWrapper>
            <QrCodeImage src={qr} />
            <AuthDescription>
              or manually enter the key in the application:
            </AuthDescription>
            <QrCodeKeyWrapper>
              <QrCodeKey>{code}</QrCodeKey>
            </QrCodeKeyWrapper>
            <NextButton onClick={onClickNext}>Next</NextButton>
          </InnerWrapper>
        </AuthWrapper>
      </WrapperAlignTop>
    );
  }
}

export default TwoFactorCreateForm;
