import React from 'react';
import { Error, Head } from '@caesar/components';
import { SecureMessageContainer } from '@caesar/containers';
import { getSecureMessage } from '@caesar/common/api';
import { UUID_REGEXP } from '@caesar/common/constants';
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
    const plObject = base64ToObject(id);
    if (!plObject || typeof plObject.messageId === 'undefined') {
      logger.error('The messageId not found, args: %s,', JSON.stringify(query));

      return { statusCode: 404 };
    }
    id = plObject.messageId;
    password = plObject.password;
  }

  try {
    const { data } = await getSecureMessage(id);

    return { message: data.message, password };
  } catch (e) {
    logger.error(JSON.stringify(e.data, null, 4));

    return { statusCode: 404 };
  }
};

export default MessagePage;
