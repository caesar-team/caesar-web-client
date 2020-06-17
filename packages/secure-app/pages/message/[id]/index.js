import React from 'react';
import { Error, Head } from '@caesar/components';
import { SecureMessageContainer } from '@caesar/containers';
import { getSecureMessage } from '@caesar/common/api';
import { IS_PROD, UUID_REGEXP } from '@caesar/common/constants';
import { base64ToObject } from '@caesar/common/utils/base64';

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
  console.log('UUID_REGEXP', UUID_REGEXP.test(id));
  console.log(query);
  if (id.length > 0 && !UUID_REGEXP.test(id)) {
    const plObject = base64ToObject(id);
    console.log('plObject', plObject);
    id = plObject.messageId;
    password = plObject.password;
    console.log(id, password);
  }

  try {
    const { data } = await getSecureMessage(id);
    return { message: data.message, password };
  } catch (e) {
    if (!IS_PROD) {
      console.log(e.data);
    }
    return { statusCode: 404 };
  }
};

export default MessagePage;
