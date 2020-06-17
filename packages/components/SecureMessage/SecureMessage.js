import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import { match } from '@caesar/common/utils/match';
import {
  encryptByPassword,
  decryptByPassword,
} from '@caesar/common/utils/cipherUtils';
import { postSecureMessage } from '@caesar/common/fetch';
import {
  ENCRYPTING_ITEM_NOTIFICATION,
  SAVE_NOTIFICATION,
  VERIFICATION_IN_PROGRESS_NOTIFICATION,
} from '@caesar/common/constants';
import { Scrollbar, withNotification } from '@caesar/components';
import passwordGenerator from '@caesar/common/utils/passwordGenerator';
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
        const pwd = passwordValue || passwordGenerator();

        const encryptedMessage = await encryptByPassword(secret, pwd);

        notification.show({
          text: VERIFICATION_IN_PROGRESS_NOTIFICATION,
          options: {
            position: 'bottom-right',
          },
        });

        await decryptByPassword(encryptedMessage, pwd);

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
          setState({
            step: SECURE_MESSAGE_LINK_STEP,
            password: pwd,
            link: id,
          });
        });
      } catch (error) {
        console.log(error);
        setFieldError('form', error.message);
        notification.hide();
        setSubmitting(false);
      }
    };

    submit();
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
