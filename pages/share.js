import React, { Fragment } from 'react';
import { Error, Head } from 'components';
import { Bootstrap, Sharing } from 'containers';
import { base64ToObject } from 'common/utils/cipherUtils';
import { login } from 'common/utils/loginUtils';
import { getCheckShare, postLoginPrepare, postLogin } from 'common/api';

const validFields = ['shareId', 'email', 'password'];

const validateShare = (data, fields) =>
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
  query: { encryption = '' },
}) => {
  const shared = base64ToObject(encryption);

  if (!shared || !validateShare(shared, validFields)) {
    return { statusCode: 404 };
  }

  try {
    await getCheckShare(shared.shareId);

    if (!req || !req.cookies || !req.cookies.token) {
      const jwt = await login(shared.email, shared.password, {
        prepareLoginEndpoint: postLoginPrepare,
        loginEndpoint: postLogin,
      });

      res.cookie('token', jwt, { path: '/' });
    }

    return { shared };
  } catch (e) {
    return { statusCode: 404 };
  }
};

export default SharePage;
