import React, { Fragment } from 'react';
import { Error, Head } from 'components';
import { Bootstrap, Sharing } from 'containers';
import { base64ToObject } from 'common/utils/base64';
import { login } from 'common/utils/authUtils';
import { getCheckShare } from 'common/api';

const validFields = ['e', 'p'];

const validateFields = (data, fields) =>
  data && fields.every(field => !!data[field]);

const SharePage = ({ statusCode, shared }) => (
  <Fragment>
    <Head title="Sharing" />
    {statusCode ? (
      <Error statusCode={statusCode} />
    ) : (
      <Bootstrap component={Sharing} shared={shared} />
    )}
  </Fragment>
);

SharePage.getInitialProps = async ({
  req,
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

    console.error(cause);
    return { statusCode: 404 };
  }

  try {
    await getCheckShare(shareId);

    if (!req || !req.cookies || !req.cookies.token) {
      const jwt = await login(shared.e, shared.p);

      res.cookie('token', jwt, { path: '/' });
    }

    return { shared };
  } catch (e) {
    return { statusCode: 404 };
  }
};

export default SharePage;
