import React, { Component } from 'react';
import Router from 'next/router';
import { Error } from 'components';
import { base64ToObject } from 'common/utils/cipherUtils';
import { createSrp } from 'common/utils/srp';
import { setToken } from 'common/utils/token';
import { postLoginPrepare, postLogin, postCheckShare } from 'common/api';

const srp = createSrp();

const validateShare = (data, fields) =>
  data && fields.every(field => !!data[field]);

const createMatcher = ({ login, password, A, a, B, seed }) => {
  const S = srp.generateClientS(A, B, a, srp.generateX(seed, login, password));
  const M1 = srp.generateM1(A, B, S);

  return { S, M1 };
};

const redirectToAuth = () => Router.push('/auth');

class Sharing extends Component {
  state = {
    isValidShare: true,
  };

  async componentDidMount() {
    const { encryption } = this.props;

    if (!encryption) {
      redirectToAuth();
    }

    const data = base64ToObject(encryption);

    const shareIsValid = validateShare(data, [
      'shareId',
      'login',
      'password',
      'masterPassword',
    ]);

    if (!shareIsValid) {
      return this.setState({
        isValidShare: false,
      });
    }

    try {
      await postCheckShare(data.shareId)

      const jwt = await this.loginResolver(data.login, data.password);

      setToken(jwt);

      return Router.push('/');
    } catch (e) {
      console.log(e);
    }
  }

  componentDidCatch() {
    this.setState({
      isValidShare: false,
    });
  }

  async loginResolver(login, password) {
    const a = srp.getRandomSeed();
    const A = srp.generateA(a);

    const { B, seed } = await this.srpPrepareLogin(login, A);

    const { S, M1 } = createMatcher({ login, password, A, a, B, seed });

    const { serverM2, jwt } = await this.srpLogin(login, M1);

    const clientM2 = srp.generateM2(A, M1, S);

    if (clientM2 !== serverM2) {
      throw new Error('mismatch');
    }

    return jwt;
  }

  async srpPrepareLogin(login, A) {
    try {
      const {
        data: { publicEphemeralValue, seed },
      } = await postLoginPrepare({
        email: login,
        publicEphemeralValue: A,
      });

      return { B: publicEphemeralValue, seed };
    } catch (e) {
      console.log(e.response);
      throw new Error(e);
    }
  }

  async srpLogin(login, matcher) {
    try {
      const {
        data: { secondMatcher, jwt },
      } = await postLogin({
        email: login,
        matcher,
      });

      return { serverM2: secondMatcher, jwt };
    } catch (e) {
      console.log(e.response);
      throw new Error(e);
    }
  }

  render() {
    return !this.state.isValidShare && <Error statusCode={404} />;
  }
}

export default Sharing;
