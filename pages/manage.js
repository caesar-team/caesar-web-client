import React, { Fragment } from 'react';
import { ManageListContainer } from '../containers';
import { Head } from '../components';
import { isServer } from '../common/utils/isEnvironment';
import { getList, getUsers, getUserSelf } from '../common/api';
import { getToken } from '../common/utils/token';

const Manage = props => (
  <Fragment>
    <Head title="List Management" />
    <ManageListContainer {...props} />
  </Fragment>
);

Manage.getInitialProps = async ({ req }) => {
  try {
    const token = isServer ? req.cookies.token : getToken();

    const { data: list } = await getList(token);
    const { data: user } = await getUserSelf(token);
    const { data: members } = await getUsers(token);

    return { list, user, members };
  } catch (e) {
    // TODO: figure out about request errors
    // console.log(e.response);
  }

  return {};
};

export default Manage;
