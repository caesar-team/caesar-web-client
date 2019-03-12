import React, { Component } from 'react';
import * as openpgp from 'openpgp';
import { withRouter } from 'next/router';
import { BootstrapLayout } from 'components';
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
  SHARED_ITEMS_CHECK,
  BOOTSTRAP_FINISH,
} from './constants';
import {
  TwoFactorStep,
  PasswordStep,
  MasterPasswordStep,
  SharedItemsStep,
} from './Steps';

const TWO_FACTOR_STEPS = [TWO_FACTOR_CREATE, TWO_FACTOR_CHECK];
const PASSWORD_STEPS = [PASSWORD_CHANGE];
const MASTER_PASSWORD_STEPS = [MASTER_PASSWORD_CREATE, MASTER_PASSWORD_CHECK];
const SHARED_ITEMS_STEPS = [SHARED_ITEMS_CHECK];

const bootstrapStates = bootstrap => ({
  twoFactorAuthState: `TWO_FACTOR_${bootstrap.twoFactorAuthState}`,
  passwordState: `PASSWORD_${bootstrap.passwordState}`,
  masterPasswordState: `MASTER_PASSWORD_${bootstrap.masterPasswordState}`,
  sharedItemsState: `SHARED_ITEMS_${bootstrap.sharedItemsState}`,
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
      // TODO: next step equals SHARED_ITEMS_CHECK
      // TODO: also is available for moving on next step
    });
  };

  handleFinishSharedItems = () => {
    this.setState({
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
      sharedItemsState,
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

    if (SHARED_ITEMS_STEPS.includes(sharedItemsState)) {
      return sharedItemsState;
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
        <BootstrapLayout>
          <TwoFactorStep
            initialStep={currentStep}
            onFinish={this.handleFinishTwoFactor}
          />
        </BootstrapLayout>
      );
    }

    if (PASSWORD_STEPS.includes(currentStep)) {
      return (
        <BootstrapLayout>
          <PasswordStep
            email={shared.e}
            onFinish={this.handleFinishChangePassword}
          />
        </BootstrapLayout>
      );
    }

    if (MASTER_PASSWORD_STEPS.includes(currentStep)) {
      return (
        <MasterPasswordStep
          initialStep={currentStep}
          sharedMasterPassword={shared.mp}
          onFinish={this.handleFinishMasterPassword}
        />
      );
    }

    if (SHARED_ITEMS_STEPS.includes(currentStep)) {
      // TODO: pass old and new pair of keys as props
      return (
        <BootstrapLayout>
          <SharedItemsStep onFinish={this.handleFinishSharedItems} />
        </BootstrapLayout>
      );
    }

    // if user is using sharing url and master password is included inside share
    // url we don't turn on LockScreen via SessionChecker(onFinishTimeout)
    if (currentStep === BOOTSTRAP_FINISH && shared.mp) {
      return (
        <PageComponent
          publicKey={publicKey}
          privateKey={encryptedPrivateKey}
          password={masterPassword}
          {...props}
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
