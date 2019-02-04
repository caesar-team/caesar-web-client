import React from 'react';
import styled from 'styled-components';
import { AuthLayout as ErrorLayout } from 'components';
import ErrorImg from 'static/images/error.jpg';
import ErrorImg2x from 'static/images/error@2x.jpg';

const Image = styled.img`
  padding-top: 45px;
  padding-left: 15px;
  object-fit: contain;
`;

const TextWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
`;

const StatusCode = styled.div`
  font-size: 36px;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
`;

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    // eslint-disable-next-line
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;

    return (
      <ErrorLayout>
        <Image src={ErrorImg} srcSet={`${ErrorImg} 1x, ${ErrorImg2x} 2x`} />
        <TextWrapper>
          <StatusCode>{statusCode}</StatusCode>
          <Description>Oops… Something went wrong</Description>
        </TextWrapper>
      </ErrorLayout>
    );
  }
}
