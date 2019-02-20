import React, { Component } from 'react';
import { DEFAULT_IDLE_TIMEOUT } from 'common/constants';
import { SessionChecker } from 'components/SessionChecker';
import {
  TWO_FACTOR_CHECK,
  TWO_FACTOR_CREATION,
  PASSWORD_CHANGE,
  MASTER_PASSWORD_CHANGE,
  MASTER_PASSWORD_CHECK,
  MASTER_PASSWORD_CREATION,
  BOOTSTRAP_FINISH,
} from './constants';
import { TwoFactorStep, PasswordStep, MasterPasswordStep } from './Steps';

const TWO_FACTOR_STEPS = [TWO_FACTOR_CHECK, TWO_FACTOR_CREATION];
const PASSWORD_STEPS = [PASSWORD_CHANGE];
const MASTER_PASSWORD_STEPS = [
  MASTER_PASSWORD_CHANGE,
  MASTER_PASSWORD_CREATION,
  MASTER_PASSWORD_CHECK,
];

class Bootstrap extends Component {
  state = this.prepareInitialState();

  handleFinishTwoFactor = () => {
    const { passwordState, masterPasswordState } = this.props;

    this.setState({
      currentStep:
        passwordState === PASSWORD_CHANGE
          ? PASSWORD_CHANGE
          : masterPasswordState,
    });
  };

  handleFinishChangePassword = () => {
    const { masterPasswordState } = this.props;

    this.setState({
      currentStep: masterPasswordState,
    });
  };

  handleFinishMasterPassword = () => {
    this.setState({
      currentStep: BOOTSTRAP_FINISH,
    });
  };

  handleInactiveTimeout = () => {
    this.setState({
      currentStep: MASTER_PASSWORD_CHECK,
    });
  };

  currentStepResolver() {
    const {
      twoFactorAuthState,
      passwordState = 'CHANGE',
      masterPasswordState,
    } = this.props;

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
    };
  }

  render() {
    const { currentStep } = this.state;
    const { children, sharedMasterPassword } = this.props;

    if (TWO_FACTOR_STEPS.includes(currentStep)) {
      return (
        <TwoFactorStep
          initialStep={currentStep}
          onFinish={this.handleFinishTwoFactor}
        />
      );
    }

    if (PASSWORD_STEPS.includes(currentStep)) {
      return <PasswordStep onFinish={this.handleFinishChangePassword} />;
    }

    if (MASTER_PASSWORD_STEPS.includes(currentStep)) {
      return (
        <MasterPasswordStep
          initialStep={currentStep}
          sharedMasterPassword={sharedMasterPassword}
          onFinish={this.handleFinishMasterPassword}
        />
      );
    }

    return (
      <SessionChecker
        timeout={DEFAULT_IDLE_TIMEOUT}
        onFinishTimeout={this.handleInactiveTimeout}
      >
        {children}
      </SessionChecker>
    );
  }
}

export default Bootstrap;
