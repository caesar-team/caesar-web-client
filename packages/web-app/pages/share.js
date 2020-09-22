import React from 'react';
import { Error, Head } from '@caesar/components';
import { Bootstrap, Sharing } from '@caesar/containers';
import { base64ToObject } from '@caesar/common/utils/base64';
import { login } from '@caesar/common/utils/authUtils';
import { getCheckShare } from '@caesar/common/api';

const validFields = ['e', 'p'];

const validateFields = (data, fields) =>
  data && fields.every(field => !!data[field]);

const SharePage = ({ statusCode, shared }) => (
  <>
    <Head title="Sharing" />
    {statusCode ? (
      <Error statusCode={statusCode} />
    ) : (
      <Bootstrap component={Sharing} shared={shared} />
    )}
  </>
);

SharePage.getInitialProps = async ({
  res,
  query: { encryption = '', shareId = '' },
}) => {
  const shared = base64ToObject(encryption);
  const isFieldsValidated = validateFields(shared, validFields);

  if (!shared || !isFieldsValidated) {
    let cause = '';

    if (!shared) {
      cause += '404 caused by the shared variable. \n';
    }

    if (!isFieldsValidated) {
      cause += '404 caused by the isFieldsValidated function. \n';
    }

    // eslint-disable-next-line no-console
    console.error(cause);

    return { statusCode: 404 };
  }

  try {
    await getCheckShare(shareId);

    const jwt = await login(shared.e, shared.p);

    res.cookie('token', jwt, { path: '/' });

    return { shared };
  } catch (e) {
    return { statusCode: 404 };
  }
};

export default SharePage;
