import React, { Component } from 'react';
import { matchStrict } from 'common/utils/match';
import {
  MASTER_PASSWORD_CHANGE,
  MASTER_PASSWORD_CHECK,
  MASTER_PASSWORD_CREATION,
  MASTER_PASSWORD_CONFIRM,
} from '../../constants';
import MasterPasswordSharedForm from './MasterPasswordSharedForm';
import MasterPasswordCheckForm from './MasterPasswordCheckForm';
import MasterPasswordCreateForm from './MasterPasswordCreateForm';
import MasterPasswordConfirmForm from './MasterPasswordConfirmForm';

class MasterPasswordStep extends Component {
  state = this.prepareInitialState();

  handleSubmitSharedPassword = ({ password }, { setSubmitting, setErrors }) => {
    console.log('handleSubmitSharedPassword', password);
  };

  handleSubmitCheckPassword = ({ password }, { setSubmitting, setErrors }) => {
    console.log('handleSubmitCheckPassword', password);
  };

  handleSubmitCreatePassword = ({ password }, { setSubmitting, setErrors }) => {
    console.log('handleSubmitCreatePassword', password);
  };

  handleSubmitConfirmPassword = ({ confirmPassword }, { setSubmitting, setErrors }) => {
    console.log('handleSubmitConfirmPassword', confirmPassword);
  };

  prepareInitialState() {
    const { initialStep } = this.props;

    return {
      step: initialStep,
    };
  }

  render() {
    const { step } = this.state;

    return matchStrict(
      step,
      {
        [MASTER_PASSWORD_CHANGE]: (
          <MasterPasswordSharedForm
            onSubmit={this.handleSubmitSharedPassword}
          />
        ),
        [MASTER_PASSWORD_CREATION]: (
          <MasterPasswordCreateForm
            onSubmit={this.handleSubmitCreatePassword}
          />
        ),
        [MASTER_PASSWORD_CONFIRM]: (
          <MasterPasswordConfirmForm
            onSubmit={this.handleSubmitConfirmPassword}
          />
        ),
        [MASTER_PASSWORD_CHECK]: (
          <MasterPasswordCheckForm onSubmit={this.handleSubmitCheckPassword} />
        ),
      },
      null,
    );
  }
}

export default MasterPasswordStep;
