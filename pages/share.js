import React, { Fragment } from 'react';
import { Head } from 'components';
import { Sharing } from 'containers';
import { base64ToObject } from 'common/utils/cipherUtils';
import { redirectTo } from 'common/utils/routerUtils';
import { postCheckShare } from 'common/api';

const validFields = ['shareId', 'login', 'password', 'masterPassword'];

const validateShare = (data, fields) =>
  data && fields.every(field => !!data[field]);

const SharePage = props => (
  <Fragment>
    <Head title="Sharing" />
    <Sharing {...props} />
  </Fragment>
);

SharePage.getInitialProps = async ({ query: { encryption = '' }, res }) => {
  const shared = base64ToObject(encryption);

  if (!shared || !validateShare(shared, validFields)) {
    return redirectTo(res, '', 404);
  }

  try {
    await postCheckShare(shared.shareId);

    return { ...shared };
  } catch (e) {
    return redirectTo(res, '', 404);
  }
};

export default SharePage;
