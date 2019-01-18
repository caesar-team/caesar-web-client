import React, { Fragment } from 'react';
import { TwoFactorAuthentication } from 'containers';
import { Head } from 'components';
import { getQrCode } from 'common/api';

const TwoFactorAuthenticationPage = props => (
  <Fragment>
    <Head title="Two Factor Authentication" />
    <TwoFactorAuthentication {...props} />
  </Fragment>
);

TwoFactorAuthenticationPage.getInitialProps = async ({ query }) => {
  if (query.isCheck) return { isCheck: true };

  const {
    data: { qr, code },
  } = await getQrCode();

  return { qr, code };
};

export default TwoFactorAuthenticationPage;
