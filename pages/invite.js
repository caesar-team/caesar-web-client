import React, { Fragment } from 'react';
import { Error, Head } from 'components';
import { Bootstrap, Invite } from 'containers';
import { base64ToObject } from 'common/utils/cipherUtils';
import { login } from 'common/utils/authUtils';

const validFields = ['e', 'p', 'mp'];

const validateFields = (data, fields) =>
  data && fields.every(field => !!data[field]);

const InvitePage = ({ statusCode, shared }) => (
  <Fragment>
    <Head title="Sharing" />
    {statusCode ? (
      <Error statusCode={statusCode} />
    ) : (
      <Bootstrap component={Invite} shared={shared} />
    )}
  </Fragment>
);

InvitePage.getInitialProps = async ({
  req,
  res,
  query: { encryption = '' },
}) => {
  const shared = base64ToObject(encryption);

  if (!shared || !validateFields(shared, validFields)) {
    return { statusCode: 404 };
  }

  try {
    if (!req || !req.cookies || !req.cookies.token) {
      const jwt = await login(shared.e, shared.p);

      res.cookie('token', jwt, { path: '/' });
    }

    return { shared };
  } catch (e) {
    return { statusCode: 404 };
  }
};

export default InvitePage;
