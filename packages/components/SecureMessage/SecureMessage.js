import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import { match } from '@caesar/common/utils/match';
import {
  encryptByPassword,
  decryptByPassword,
} from '@caesar/common/utils/cipherUtils';
import { generator } from '@caesar/common/utils/password';
import { postSecureMessage } from '@caesar/common/api';
import { ENCRYPTING_ITEM_NOTIFICATION } from '@caesar/common/constants';
import { Scrollbar, withNotification } from '@caesar/components';
import { SecureMessageForm } from './SecureMessageForm';
import { SecureMessageLink } from './SecureMessageLink';
import {
  SECURE_MESSAGE_FORM_STEP,
  SECURE_MESSAGE_LINK_STEP,
} from './constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 150px);
  padding: 38px 0;

  ${media.desktop`
    padding: 22px 0;
  `}

  ${media.mobile`
    padding: 16px 0;
  `}
`;

const SecureMessageComponent = ({
  notification,
  withScroll = false,
  className,
}) => {
  const [{ step, password, link }, setState] = useState({
    step: SECURE_MESSAGE_FORM_STEP,
    password: null,
    link: null,
  });

  const handleSubmitForm = async (
    { secondsLimit, requestsLimit, password: passwordValue, ...secret },
    { setSubmitting, setFieldError },
  ) => {
    setFieldError('form', '');

    try {
      notification.show({
        text: ENCRYPTING_ITEM_NOTIFICATION,
      });
      const pwd = passwordValue || generator();

      const encryptedMessage = await encryptByPassword(secret, pwd);
      await decryptByPassword(encryptedMessage, pwd);

      const {
        data: { id },
      } = await postSecureMessage({
        message: encryptedMessage,
        secondsLimit,
        requestsLimit,
      });

      setState({
        step: SECURE_MESSAGE_LINK_STEP,
        password: pwd,
        link: id,
      });
    } catch (error) {
      console.log(error);
      setFieldError('form', error.message);
    } finally {
      setSubmitting(false);
      notification.hide();
    }
  };

  const handleClickReturn = () => {
    setState({
      step: SECURE_MESSAGE_FORM_STEP,
      password: null,
      link: null,
    });
  };

  const renderedStep = match(
    step,
    {
      SECURE_MESSAGE_FORM_STEP: (
        <SecureMessageForm onSubmit={handleSubmitForm} />
      ),
      SECURE_MESSAGE_LINK_STEP: (
        <SecureMessageLink
          link={link}
          password={password}
          onClickReturn={handleClickReturn}
        />
      ),
    },
    null,
  );

  const ContentWrapperComponent = withScroll ? Scrollbar : Fragment;

  return (
    <Wrapper className={className}>
      <ContentWrapperComponent>{renderedStep}</ContentWrapperComponent>
    </Wrapper>
  );
};

export const SecureMessage = withNotification(SecureMessageComponent);
