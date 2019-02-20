import React, { Component } from 'react';
import { AuthLayout } from 'components';
import {
  postActivateTwoFactor,
  postCheckTwoFactor,
  getQrCode,
} from 'common/api';
import { getTrustedDeviceToken } from 'common/utils/token';
import { matchStrict } from 'common/utils/match';
import { TWO_FACTOR_CREATION, TWO_FACTOR_CHECK } from '../../constants';
import TwoFactorCreateForm from './TwoFactorCreateForm';
import TwoFactorCheckForm from './TwoFactorCheckForm';

class TwoFactorStep extends Component {
  state = this.prepareInitialState();

  async componentDidMount() {
    const {
      data: { qr, code },
    } = await getQrCode();

    this.setState({
      qr,
      code,
    });
  }

  handleClickReturn = () => {
    this.setState({
      step: TWO_FACTOR_CREATION,
    });
  };

  handleClickNext = () => {
    this.setState({
      step: TWO_FACTOR_CHECK,
    });
  };

  handleSubmit = async ({ code, fpCheck }, { setSubmitting, setErrors }) => {
    const { initialStep, onFinish } = this.props;

    const isCreateFlow = initialStep === TWO_FACTOR_CREATION;

    const post = { authCode: code };

    if (fpCheck) {
      post.fingerprint = await getTrustedDeviceToken(true);
    }

    if (isCreateFlow) {
      post.secret = this.state.code;
    }

    const action = isCreateFlow ? postActivateTwoFactor : postCheckTwoFactor;

    try {
      await action(post);

      onFinish();
    } catch (error) {
      setErrors({ code: 'Wrong code' });
      setSubmitting(false);
    }
  };

  prepareInitialState() {
    const { initialStep } = this.props;

    return {
      step: initialStep,
      code: '',
      qr: '',
    };
  }

  render() {
    const { qr, code, step } = this.state;
    const { initialStep } = this.props;

    const allowReturn = initialStep === TWO_FACTOR_CREATION;

    const renderedStep = matchStrict(
      step,
      {
        [TWO_FACTOR_CREATION]: (
          <TwoFactorCreateForm
            qr={qr}
            code={code}
            onClickNext={this.handleClickNext}
          />
        ),
        [TWO_FACTOR_CHECK]: (
          <TwoFactorCheckForm
            allowReturn={allowReturn}
            onClickReturn={this.handleClickReturn}
            onSubmit={this.handleSubmit}
          />
        ),
      },
      null,
    );

    return <AuthLayout>{renderedStep}</AuthLayout>;
  }
}

export default TwoFactorStep;
