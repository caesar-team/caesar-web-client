import React from 'react';
import Error from 'next/error';

export default class ErrorPage extends React.Component {
  static getInitialProps({ res, err }) {
    // eslint-disable-next-line
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;

    return <Error statusCode={statusCode} />;
  }
}
