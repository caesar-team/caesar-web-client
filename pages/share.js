import React, { Fragment } from 'react';
import { Error, Head } from 'components';
import { Sharing } from 'containers';
import { base64ToObject } from 'common/utils/cipherUtils';
import { getCheckShare } from 'common/api';

const validFields = ['shareId', 'email', 'password', 'isAnonymous'];

const validateShare = (data, fields) =>
  data && fields.every(field => !!data[field]);

const SharePage = ({ statusCode, ...props }) => (
  <Fragment>
    <Head title="Sharing" />
    {statusCode ? <Error statusCode={statusCode} /> : <Sharing {...props} />}
  </Fragment>
);

SharePage.getInitialProps = async ({ query: { encryption = '' } }) => {
  const shared = base64ToObject(encryption);

  if (!shared || !validateShare(shared, validFields)) {
    return { statusCode: 404 };
  }

  try {
    await getCheckShare(shared.shareId);

    return { encryption };
  } catch (e) {
    return { statusCode: 404 };
  }
};

export default SharePage;
