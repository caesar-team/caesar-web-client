import { Component } from 'react';
import Router from 'next/router';
import { Error } from 'components';
import { createSrp } from 'common/utils/srp';
import { setToken } from 'common/utils/token';
import { postLoginPrepare, postLogin } from 'common/api';

const srp = createSrp();

const createMatcher = ({ email, password, A, a, B, seed }) => {
  const S = srp.generateClientS(A, B, a, srp.generateX(seed, email, password));
  const M1 = srp.generateM1(A, B, S);

  return { S, M1 };
};

class Sharing extends Component {
  async componentDidMount() {
    const { email, password } = this.props;

    const jwt = await this.loginResolver(email, password);

    setToken(jwt);

    Router.push('/');
  }

  async loginResolver(email, password) {
    const a = srp.getRandomSeed();
    const A = srp.generateA(a);

    const { B, seed } = await this.srpPrepareLogin(email, A);

    const { S, M1 } = createMatcher({ email, password, A, a, B, seed });

    const { serverM2, jwt } = await this.srpLogin(email, M1);

    const clientM2 = srp.generateM2(A, M1, S);

    if (clientM2 !== serverM2) {
      throw new Error('mismatch');
    }

    return jwt;
  }

  async srpPrepareLogin(email, A) {
    try {
      const {
        data: { publicEphemeralValue, seed },
      } = await postLoginPrepare({
        email,
        publicEphemeralValue: A,
      });

      return { B: publicEphemeralValue, seed };
    } catch (e) {
      console.log(e.response);
      throw new Error(e);
    }
  }

  async srpLogin(email, matcher) {
    try {
      const {
        data: { secondMatcher, jwt },
      } = await postLogin({
        email,
        matcher,
      });

      return { serverM2: secondMatcher, jwt };
    } catch (e) {
      console.log(e.response);
      throw new Error(e);
    }
  }

  render() {
    return null;
  }
}

export default Sharing;
