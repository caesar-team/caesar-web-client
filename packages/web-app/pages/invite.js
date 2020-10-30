import React from 'react';
import { Error, Head } from '@caesar/components';
import { Bootstrap, Invite } from '@caesar/containers';
import { base64ToObject } from '@caesar/common/utils/base64';
import { login } from '@caesar/common/utils/authUtils';

const validFields = ['e', 'p', 'm'];

const validateFields = (data, fields) =>
  data && fields.every(field => !!data[field]);

const InvitePage = ({ statusCode, shared }) => (
  <>
    <Head title="Invite" />
    {statusCode ? (
      <Error statusCode={statusCode} />
    ) : (
      <Bootstrap component={Invite} shared={shared} />
    )}
  </>
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
