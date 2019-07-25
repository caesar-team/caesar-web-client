import React, { Fragment } from 'react';
import { DashboardContainer } from '../containers';
import { Head } from '../components';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

const DashboardPage = props => (
  <Fragment>
    <Head title="Dashboard" />
    <DashboardContainer {...props} />
  </Fragment>
);

export default DashboardPage;
