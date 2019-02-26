import React, { Fragment } from 'react';
import { Head } from 'components';
import { SettingsImport } from 'containers';
import { isServer } from '../../common/utils/isEnvironment';
import { getToken } from '../../common/utils/token';
import { getUserSelf } from '../../common/api';

const SettingsImportPage = props => (
  <Fragment>
    <Head title="Import" />
    <SettingsImport {...props} />
  </Fragment>
);

SettingsImportPage.getInitialProps = async ({ req }) => {
  try {
    const token = isServer ? req.cookies.token : getToken();
    const { data: user } = await getUserSelf(token);

    return {
      user,
    };
  } catch (e) {
    // TODO: figure out about request errors
    // console.log(e.response);
  }

  return {};
};

export default SettingsImportPage;
