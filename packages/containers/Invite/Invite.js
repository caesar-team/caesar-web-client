import { Component } from 'react';
import Router from 'next/router';
import { ROUTES } from '@caesar/common/constants';

class Invite extends Component {
  componentDidMount() {
    Router.push(ROUTES.DASHBOARD);
  }

  render() {
    return null;
  }
}

export default Invite;
