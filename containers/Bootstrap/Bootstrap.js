import React, { Component } from 'react';
import * as openpgp from 'openpgp';
import { withRouter } from 'next/router';
import { BootstrapWrapper } from 'components';
import { getUserBootstrap } from 'common/api';
import { DEFAULT_IDLE_TIMEOUT } from 'common/constants';
import OpenPGPWorker from 'common/openpgp.worker';
import { SessionChecker } from 'components/SessionChecker';
import {
  TWO_FACTOR_CHECK,
  TWO_FACTOR_CREATE,
  PASSWORD_CHANGE,
  MASTER_PASSWORD_CHECK,
  MASTER_PASSWORD_CREATE,
  BOOTSTRAP_FINISH,
} from './constants';
import { TwoFactorStep, PasswordStep, MasterPasswordStep } from './Steps';

const TWO_FACTOR_STEPS = [TWO_FACTOR_CREATE, TWO_FACTOR_CHECK];
const PASSWORD_STEPS = [PASSWORD_CHANGE];
const MASTER_PASSWORD_STEPS = [MASTER_PASSWORD_CREATE, MASTER_PASSWORD_CHECK];

const bootstrapStates = bootstrap => ({
  twoFactorAuthState: `TWO_FACTOR_${bootstrap.twoFactorAuthState}`,
  passwordState: `PASSWORD_${bootstrap.passwordState}`,
  masterPasswordState: `MASTER_PASSWORD_${bootstrap.masterPasswordState}`,
});

class Bootstrap extends Component {
  state = this.prepareInitialState();

  worker = null;

  bootstrap = null;

  async componentDidMount() {
    this.initOpenPGPWorker();

    const { data: bootstrap } = await getUserBootstrap();

    this.bootstrap = bootstrapStates(bootstrap);

    this.setState({
      currentStep: this.currentStepResolver(bootstrap),
    });
  }

  handleFinishTwoFactor = () => {
    const { passwordState, masterPasswordState } = this.bootstrap;

    this.setState({
      currentStep:
        passwordState === PASSWORD_CHANGE
          ? PASSWORD_CHANGE
          : masterPasswordState,
    });
  };

  handleFinishChangePassword = () => {
    const { masterPasswordState } = this.bootstrap;

    this.setState({
      currentStep: masterPasswordState,
    });
  };

  handleFinishMasterPassword = ({
    publicKey,
    encryptedPrivateKey,
    masterPassword,
  }) => {
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

  initOpenPGPWorker() {
    openpgp.config.aead_protect = false;

    this.worker = new OpenPGPWorker();

    openpgp.initWorker({ workers: [this.worker] });
  }

  currentStepResolver(bootstrap) {
    const {
      twoFactorAuthState,
      passwordState,
      masterPasswordState,
    } = bootstrapStates(bootstrap);

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
      currentStep: null,
      publicKey: null,
      encryptedPrivateKey: null,
      masterPassword: null,
    };
  }

  render() {
    const {
      component: PageComponent,
      router,
      shared = {},
      ...props
    } = this.props;
    const {
      currentStep,
      publicKey,
      encryptedPrivateKey,
      masterPassword,
    } = this.state;

    if (TWO_FACTOR_STEPS.includes(currentStep)) {
      return (
        <BootstrapWrapper>
          <TwoFactorStep
            initialStep={currentStep}
            onFinish={this.handleFinishTwoFactor}
          />
        </BootstrapWrapper>
      );
    }

    if (PASSWORD_STEPS.includes(currentStep)) {
      return (
        <BootstrapWrapper>
          <PasswordStep
            email={shared.email}
            onFinish={this.handleFinishChangePassword}
          />
        </BootstrapWrapper>
      );
    }

    if (MASTER_PASSWORD_STEPS.includes(currentStep)) {
      return (
        <MasterPasswordStep
          initialStep={currentStep}
          sharedMasterPassword={shared.masterPassword}
          onFinish={this.handleFinishMasterPassword}
        />
      );
    }

    // TODO: during refactoring to rename:
    // TODO: - password to masterPassword
    // TODO: - privateKey to encryptedPrivateKey
    return (
      currentStep === BOOTSTRAP_FINISH && (
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
