import React, { Fragment } from 'react';
import { ManageListContainer } from '../containers';
import { Head } from '../components';

const Manage = props => (
  <Fragment>
    <Head title="List Management" />
    <ManageListContainer {...props} />
  </Fragment>
);

export default Manage;
