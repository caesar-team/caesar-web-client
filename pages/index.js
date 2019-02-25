import React, { Fragment } from 'react';
import { DashboardContainer } from '../containers';
import { Head } from '../components';

const DashboardPage = props => (
  <Fragment>
    <Head title="Dashboard" />
    <DashboardContainer {...props} />
  </Fragment>
);

export default DashboardPage;
