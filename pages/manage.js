import React, { Fragment } from 'react';
import { ManageListContainer } from '../containers';
import { Head } from '../components';
import { isServer } from '../common/utils/isEnvironment';
import { getList, getUserSelf } from '../common/api';
import { getToken } from '../common/utils/token';

const Manage = ({ list, user }) => (
  <Fragment>
    <Head title="List Management" />
    <ManageListContainer list={list} user={user} />
  </Fragment>
);

Manage.getInitialProps = async ({ req }) => {
  try {
    const token = isServer ? req.cookies.token : getToken();

    const { data: list } = await getList(token);
    const { data: user } = await getUserSelf(token);

    return { list, user };
  } catch (e) {
    // TODO: figure out about request errors
    // console.log(e.response);
  }

  return {};
};

export default Manage;
