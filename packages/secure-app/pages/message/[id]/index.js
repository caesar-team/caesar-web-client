import React, { Fragment } from 'react';
import { Error, Head } from '@caesar/components';
import { SecureMessageContainer } from '@caesar/containers';
import { getSecureMessage } from '@caesar/common/api';
import { IS_PROD } from '@caesar/common/constants';

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

MessagePage.getInitialProps = async ({ query: { id = '' } }) => {
  try {
    const { data } = await getSecureMessage(id);
    return { message: data.message };
  } catch (e) {
    if (!IS_PROD) {
      console.log(e);
    }
    return { statusCode: 404 };
  }
};

export default MessagePage;
