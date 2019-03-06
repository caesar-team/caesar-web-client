import React, { Fragment } from 'react';
import { Error, Head } from 'components';
import { Bootstrap, Sharing } from 'containers';
import { base64ToObject } from 'common/utils/cipherUtils';
import { login } from 'common/utils/loginUtils';
import { getCheckShare, postLoginPrepare, postLogin } from 'common/api';

const validFields = ['e', 'p'];

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
  query: { encryption = '', shareId = '' },
}) => {
  const shared = base64ToObject(encryption);
  console.log(shared);
  
  if (!shared || !validateShare(shared, validFields)) {
    return { statusCode: 404 };
  }

  try {
    await getCheckShare(shareId);

    if (!req || !req.cookies || !req.cookies.token) {
      const jwt = await login(shared.e, shared.p, {
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
