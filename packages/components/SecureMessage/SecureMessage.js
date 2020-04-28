import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import { match } from '@caesar/common/utils/match';
import { encryptByPassword } from '@caesar/common/utils/cipherUtils';
import { generator } from '@caesar/common/utils/password';
import { postSecureMessage } from '@caesar/common/api';
import { Scrollbar } from '@caesar/components';
import SecureMessageForm from './SecureMessageForm';
import SecureMessageLink from './SecureMessageLink';
import {
  SECURE_MESSAGE_FORM_STEP,
  SECURE_MESSAGE_LINK_STEP,
} from './constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 40px 0;
  min-height: calc(100vh - 150px);

  ${media.mobile`
    padding: 20px 0;
  `}
`;

const Title = styled.div`
  font-size: 36px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 40px;

  ${media.mobile`
    margin-bottom: 10px;
    line-height: 1.11;
  `}
`;

class SecureMessage extends Component {
  state = {
    step: SECURE_MESSAGE_FORM_STEP,
  };

  handleSubmitForm = async (
    { secondsLimit, requestsLimit, password, ...secret },
    { setSubmitting },
  ) => {
    try {
      const pwd = password || generator();

      const encryptedMessage = await encryptByPassword(secret, pwd);

      const {
        data: { id },
      } = await postSecureMessage({
        message: encryptedMessage,
        secondsLimit,
        requestsLimit,
      });

      this.setState({
        step: SECURE_MESSAGE_LINK_STEP,
        password: pwd,
        link: id,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  handleClickReturn = () => {
    this.setState({
      link: null,
      password: null,
      step: SECURE_MESSAGE_FORM_STEP,
    });
  };

  render() {
    const { withScroll = false, className } = this.props;
    const { step, password, link } = this.state;

    const renderedStep = match(
      step,
      {
        SECURE_MESSAGE_FORM_STEP: (
          <SecureMessageForm onSubmit={this.handleSubmitForm} />
        ),
        SECURE_MESSAGE_LINK_STEP: (
          <SecureMessageLink
            link={link}
            password={password}
            onClickReturn={this.handleClickReturn}
          />
        ),
      },
      null,
    );

    const ContentWrapperComponent = withScroll ? Scrollbar : Fragment;

    return (
      <Wrapper className={className}>
        <ContentWrapperComponent>
          <Title>Caesar Secure Message</Title>
          {renderedStep}
        </ContentWrapperComponent>
      </Wrapper>
    );
  }
}

export default SecureMessage;
