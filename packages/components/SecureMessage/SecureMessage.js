import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import { match } from '@caesar/common/utils/match';
import {
  encryptByPassword,
  decryptByPassword,
} from '@caesar/common/utils/cipherUtils';
import { logger } from '@caesar/common/utils/logger';
import { generator } from '@caesar/common/utils/password';
import { postSecureMessage } from '@caesar/common/fetch';
import {
  ENCRYPTING_ITEM_NOTIFICATION,
  SAVE_NOTIFICATION,
} from '@caesar/common/constants';
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

const defaultState = {
  step: SECURE_MESSAGE_FORM_STEP,
  password: null,
  messageId: null,
  seconds: null,
  requests: null,
};

const SecureMessageComponent = ({
  notification,
  withScroll = false,
  className,
}) => {
  const [{ step, password, messageId, seconds, requests }, setState] = useState(
    defaultState,
  );

  const handleSubmitForm = (
    { secondsLimit, requestsLimit, password: passwordValue, ...secret },
    { setSubmitting, setFieldError },
  ) => {
    const submit = async () => {
      setFieldError('form', '');

      try {
        notification.show({
          text: ENCRYPTING_ITEM_NOTIFICATION,
          options: {
            position: 'bottom-right',
          },
        });
        const pwd = passwordValue || generator();

        const encryptedMessage = await encryptByPassword(secret, pwd);
        await decryptByPassword(encryptedMessage, pwd);

        notification.hide();
        notification.show({
          text: SAVE_NOTIFICATION,
          options: {
            timeout: 0,
            position: 'bottom-right',
          },
        });

        postSecureMessage({
          message: encryptedMessage,
          secondsLimit,
          requestsLimit,
        }).then(({ id }) => {
          setSubmitting(false);

          if (!id) {
            notification.hide();
            setFieldError(
              'form',
              'No connection to server. Please try again later.',
            );

            return;
          }

          setState({
            step: SECURE_MESSAGE_LINK_STEP,
            password: pwd,
            seconds: secondsLimit,
            requests: requestsLimit,
            messageId: id,
          });
        });
      } catch (error) {
        logger.error(error);
        setFieldError('form', error.message);
        notification.hide();
        setSubmitting(false);
      }
    };

    submit().then();
  };

  const handleClickReturn = () => {
    setState({
      step: SECURE_MESSAGE_FORM_STEP,
      password: null,
      link: null,
      seconds: null,
      requests: null,
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
          messageId={messageId}
          password={password}
          seconds={seconds}
          requests={requests}
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
