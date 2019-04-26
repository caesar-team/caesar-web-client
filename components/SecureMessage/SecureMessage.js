import React, { Component } from 'react';
import styled from 'styled-components';
import { match } from 'common/utils/match';
import { encryptByPassword } from 'common/utils/cipherUtils';
import { generator } from 'common/utils/password';
import { postSecureMessage } from 'common/api';
import { Scrollbar } from 'components';
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
  padding: 40px 60px;
  height: calc(100vh - 70px);
`;

const Title = styled.div`
  font-size: 36px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 40px;
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

    return (
      <Wrapper>
        <Scrollbar>
          <Title>Caesar Secure Message</Title>
          {renderedStep}
        </Scrollbar>
      </Wrapper>
    );
  }
}

export default SecureMessage;
