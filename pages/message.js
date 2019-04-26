import React, { Fragment } from 'react';
import { Error, Head } from 'components';
import { SecureMessageContainer } from 'containers';
import { getSecureMessage } from 'common/api';

const MessagePage = ({ statusCode, message }) => (
  <Fragment>
    <Head title="Secure Message" />
    {statusCode ? (
      <Error statusCode={statusCode} />
    ) : (
      <SecureMessageContainer message={message} />
    )}
  </Fragment>
);

MessagePage.getInitialProps = async ({ query: { messageId = '' } }) => {
  try {
    const { data } = await getSecureMessage(messageId);

    return { message: data.message };
  } catch (e) {
    return { statusCode: 404 };
  }
};

export default MessagePage;
