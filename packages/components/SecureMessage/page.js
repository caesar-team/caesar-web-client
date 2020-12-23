import React from 'react';
import { Error, Head } from '@caesar/components';
import { SecureMessageContainer } from '@caesar/containers';
import { getSecureMessage } from '@caesar/common/api';
import { SECURE_MESSAGE_REGEXP, UUID_REGEXP } from '@caesar/common/constants';
import { base64ToObject } from '@caesar/common/utils/base64';
import { logger } from '@caesar/common/utils/logger';

const MessagePage = ({ statusCode, message, password }) => (
  <>
    <Head title="Secure Message" />
    {statusCode ? (
      <Error statusCode={statusCode} />
    ) : (
      <SecureMessageContainer message={message} password={password} />
    )}
  </>
);

MessagePage.getInitialProps = async ({ query }) => {
  let { id } = query;
  let password;

  if (id.length > 0 && !UUID_REGEXP.test(id)) {
    const credLink = base64ToObject(id);

    const [
      credData = null,
      messageId = null,
      messagePassword = null,
    ] = credLink.match(SECURE_MESSAGE_REGEXP);

    if (!credData || !messageId) {
      logger.error(`The messageId not found, args: %o`, query);

      return { statusCode: 404 };
    }

    id = messageId;
    password = messagePassword;
  }

  try {
    const { data: { message } = { message: null } } = (await getSecureMessage(
      id,
    )) || { data: {} };

    if (message) {
      return { message, password };
    }

    return { statusCode: 404 };
  } catch (e) {
    logger.error(
      'The error caused by the getSecureMessage, the error: %o',
      e.data,
    );

    return { statusCode: 404 };
  }
};

export default MessagePage;
