import React, { Component } from 'react';
import * as openpgp from 'openpgp';
import { withRouter } from 'next/router';
import { base64ToObject } from 'common/utils/cipherUtils';
import { DEFAULT_IDLE_TIMEOUT } from 'common/constants';
import OpenPGPWorker from 'common/openpgp.worker';
import { SessionChecker } from 'components/SessionChecker';
import {
  TWO_FACTOR_CHECK,
  TWO_FACTOR_CREATE,
  PASSWORD_CHANGE,
  MASTER_PASSWORD_CHECK_SHARED,
  MASTER_PASSWORD_CHECK,
  MASTER_PASSWORD_CREATE,
  BOOTSTRAP_FINISH,
} from './constants';
import { TwoFactorStep, PasswordStep, MasterPasswordStep } from './Steps';

const TWO_FACTOR_STEPS = [TWO_FACTOR_CREATE, TWO_FACTOR_CHECK];
const PASSWORD_STEPS = [PASSWORD_CHANGE];
const MASTER_PASSWORD_STEPS = [
  MASTER_PASSWORD_CHECK_SHARED,
  MASTER_PASSWORD_CREATE,
  MASTER_PASSWORD_CHECK,
];

const bootstrapStates = bootstrap => ({
  twoFactorAuthState: `TWO_FACTOR_${bootstrap.twoFactorAuthState}`,
  passwordState: `PASSWORD_${bootstrap.passwordState}`,
  masterPasswordState: `MASTER_PASSWORD_${bootstrap.masterPasswordState}`,
});

class Bootstrap extends Component {
  state = this.prepareInitialState();

  worker = null;

  componentDidMount() {
    this.checkSharing();
    this.initOpenPGPWorker();
  }

  handleFinishTwoFactor = () => {
    const { passwordState, masterPasswordState } = bootstrapStates(
      this.props.bootstrap,
    );

    this.setState({
      currentStep:
        passwordState === PASSWORD_CHANGE
          ? PASSWORD_CHANGE
          : masterPasswordState,
    });
  };

  handleFinishChangePassword = () => {
    const { masterPasswordState } = bootstrapStates(this.props.bootstrap);

    this.setState({
      currentStep: masterPasswordState,
    });
  };

  handleFinishMasterPassword = ({
    publicKey,
    encryptedPrivateKey,
    masterPassword,
  }) => {
    const {
      router: { route },
    } = this.props;

    this.setState({
      publicKey,
      encryptedPrivateKey,
      masterPassword,
      currentStep: BOOTSTRAP_FINISH,
    });
  };

  handleInactiveTimeout = () => {
    this.setState({
      currentStep: MASTER_PASSWORD_CHECK,
    });
  };

  checkSharing() {
    const {
      router: { route, query },
    } = this.props;

    if (route === '/share' && query && query.encryption) {
      this.setState({
        sharedData: base64ToObject(query.encryption) || {},
      });
    }
  }

  initOpenPGPWorker() {
    openpgp.config.aead_protect = false;

    this.worker = new OpenPGPWorker();

    openpgp.initWorker({ workers: [this.worker] });
  }

  currentStepResolver() {
    const {
      twoFactorAuthState,
      passwordState,
      masterPasswordState,
    } = bootstrapStates(this.props.bootstrap);

    if (TWO_FACTOR_STEPS.includes(twoFactorAuthState)) {
      return twoFactorAuthState;
    }

    if (PASSWORD_STEPS.includes(passwordState)) {
      return passwordState;
    }

    if (MASTER_PASSWORD_STEPS.includes(masterPasswordState)) {
      return masterPasswordState;
    }

    return MASTER_PASSWORD_CHECK;
  }

  prepareInitialState() {
    return {
      currentStep: this.currentStepResolver(),
      publicKey: null,
      encryptedPrivateKey: null,
      masterPassword: null,
      sharedData: {},
    };
  }

  render() {
    const {
      component: PageComponent,
      router,
      bootstrap,
      ...props
    } = this.props;
    const {
      currentStep,
      publicKey,
      encryptedPrivateKey,
      masterPassword,
      sharedData,
    } = this.state;

    if (TWO_FACTOR_STEPS.includes(currentStep)) {
      return (
        <TwoFactorStep
          initialStep={currentStep}
          onFinish={this.handleFinishTwoFactor}
        />
      );
    }

    if (PASSWORD_STEPS.includes(currentStep)) {
      return (
        <PasswordStep
          email={sharedData.email}
          onFinish={this.handleFinishChangePassword}
        />
      );
    }

    if (MASTER_PASSWORD_STEPS.includes(currentStep)) {
      return (
        <MasterPasswordStep
          initialStep={currentStep}
          sharedMasterPassword={sharedData.masterPassword}
          onFinish={this.handleFinishMasterPassword}
        />
      );
    }

    // TODO: during refactoring to rename:
    // TODO: - password to masterPassword
    // TODO: - privateKey to encryptedPrivateKey
    return (
      BOOTSTRAP_FINISH && (
        <SessionChecker
          timeout={DEFAULT_IDLE_TIMEOUT}
          onFinishTimeout={this.handleInactiveTimeout}
        >
          <PageComponent
            publicKey={publicKey}
            privateKey={encryptedPrivateKey}
            password={masterPassword}
            {...props}
          />
        </SessionChecker>
      )
    );
  }
}

export default withRouter(Bootstrap);
