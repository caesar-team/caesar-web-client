import React, { Component, Fragment } from 'react';
import {
  getQrCode,
  getBackupCodes,
  postActivateTwoFactor,
  postCheckTwoFactor,
} from '@caesar/common/api';
import {
  getTrustedDeviceToken,
  setCookieValue,
} from '@caesar/common/utils/token';
import { matchStrict } from '@caesar/common/utils/match';
import { Head } from '@caesar/components';
import { NavigationPanelStyled } from '../../components';
import {
  TWO_FACTOR_CREATE,
  TWO_FACTOR_BACKUPS,
  TWO_FACTOR_CHECK,
} from '../../constants';
import TwoFactorForm from './TwoFactorForm';
import TwoFactorCheckForm from './TwoFactorCheckForm';
import TwoFactorBackupForm from './TwoFactorBackupForm';

class TwoFactorStep extends Component {
  state = this.prepareInitialState();

  async componentDidMount() {
    const { initialStep } = this.props;

    if (initialStep === TWO_FACTOR_CREATE) {
      const {
        data: { qr, code },
      } = await getQrCode();

      const { data: codes } = await getBackupCodes();

      this.setState({
        qr,
        code,
        codes,
      });
    }
  }

  handleSubmit = async ({ code, fpCheck }, { setSubmitting, setErrors }) => {
    const { initialStep, onFinish } = this.props;

    const isCreateFlow = initialStep === TWO_FACTOR_CREATE;

    const post = { authCode: code };

    if (fpCheck) {
      post.fingerprint = await getTrustedDeviceToken(true);
    }

    if (isCreateFlow) {
      post.secret = this.state.code;
    }

    const action = isCreateFlow ? postActivateTwoFactor : postCheckTwoFactor;

    try {
      const {
        data: { token },
      } = await action(post);

      if (token) {
        setCookieValue('token', token);
      }

      // eslint-disable-next-line
      isCreateFlow
        ? this.setState({
            step: TWO_FACTOR_BACKUPS,
          })
        : onFinish();
    } catch (error) {
      setErrors({ code: 'Wrong code' });
      setSubmitting(false);
    }
  };

  handleClickSaveBackups = () => {
    const { onFinish } = this.props;

    onFinish();
  };

  prepareInitialState() {
    const { initialStep } = this.props;

    return {
      step: initialStep,
      qr: '',
      code: '',
      codes: [],
    };
  }

  render() {
    const { navigationSteps } = this.props;
    const { qr, code, codes, step } = this.state;

    const renderedStep = matchStrict(
      step,
      {
        [TWO_FACTOR_CREATE]: (
          <TwoFactorForm qr={qr} code={code} onSubmit={this.handleSubmit} />
        ),
        [TWO_FACTOR_CHECK]: <TwoFactorCheckForm onSubmit={this.handleSubmit} />,
        [TWO_FACTOR_BACKUPS]: (
          <TwoFactorBackupForm
            codes={codes}
            onSubmit={this.handleClickSaveBackups}
          />
        ),
      },
      null,
    );

    return (
      <Fragment>
        <Head title="Two-Factor" />
        <NavigationPanelStyled currentStep={step} steps={navigationSteps} />
        {renderedStep}
      </Fragment>
    );
  }
}

export default TwoFactorStep;
