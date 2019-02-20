import React, { Fragment } from 'react';
import { Head } from 'components';
import { Sharing } from 'containers';

const SharePage = props => (
  <Fragment>
    <Head title="Sharing" />
    <Sharing {...props} />
  </Fragment>
);

SharePage.getInitialProps = ({ query: { encryption } }) => ({ encryption });

export default SharePage;
