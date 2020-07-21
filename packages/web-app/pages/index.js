import React from 'react';
import { DashboardContainer } from '@caesar/containers';
import { Head } from '@caesar/components';

const DashboardPage = props => (
  <>
    <Head title="Dashboard" />
    <DashboardContainer {...props} />
  </>
);

export default DashboardPage;
