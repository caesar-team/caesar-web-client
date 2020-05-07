import React, { Fragment } from 'react';
import { DashboardContainer } from '@caesar/containers';
import { Head } from '@caesar/components';
// import * from
const DashboardPage = props => (
  <Fragment>
    <Head title="Dashboard" />
    <DashboardContainer {...props} />
  </Fragment>
);

export default DashboardPage;
