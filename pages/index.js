import React, { Fragment } from 'react';
import { getList, getUserSelf, getUsers } from 'common/api';
import { isServer } from 'common/utils/isEnvironment';
import { getToken } from 'common/utils/token';
import { DashboardContainer } from '../containers';
import { Head } from '../components';

const DashboardPage = props => (
  <Fragment>
    <Head title="Dashboard" />
    <DashboardContainer {...props} />
  </Fragment>
);

export default DashboardPage;
