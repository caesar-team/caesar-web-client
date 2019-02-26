import React, { Component } from 'react';
import styled from 'styled-components';
import { getKeys, postKeys } from 'common/api';
import { matchStrict } from 'common/utils/match';
import {
  validateKeys,
  generateKeys,
  reencryptPrivateKey,
} from 'common/utils/key';
import { AuthLayout, WrapperAlignTop } from 'components';
import {
  MASTER_PASSWORD_CHECK_SHARED,
  MASTER_PASSWORD_CHECK,
  MASTER_PASSWORD_CREATE,
  MASTER_PASSWORD_CONFIRM,
} from '../../constants';
import MasterPasswordSharedForm from './MasterPasswordSharedForm';
import MasterPasswordCheckForm from './MasterPasswordCheckForm';
import MasterPasswordCreateForm from './MasterPasswordCreateForm';
import MasterPasswordConfirmForm from './MasterPasswordConfirmForm';

const InnerWrapper = styled(WrapperAlignTop)`
  max-width: 400px;
  width: 100%;
`;

class MasterPasswordStep extends Component {
  state = this.prepareInitialState();

  async componentDidMount() {
    const { initialStep, sharedMasterPassword, isAnonymous } = this.props;

    const state = {
      step: initialStep,
      publicKey: null,
      encryptedPrivateKey: null,
      masterPassword: null,
    };

    if (initialStep !== MASTER_PASSWORD_CREATE) {
      const {
        data: { publicKey, encryptedPrivateKey },
      } = await getKeys();

      state.publicKey = publicKey;
      state.encryptedPrivateKey = encryptedPrivateKey;
    }

    if (initialStep === MASTER_PASSWORD_CHECK_SHARED && sharedMasterPassword) {
      try {
        await validateKeys(sharedMasterPassword, state.encryptedPrivateKey);

        if (isAnonymous) {
          return this.onFinishMasterPassword(
            state.publicKey,
            state.encryptedPrivateKey,
            sharedMasterPassword,
          );
        }

        state.step = MASTER_PASSWORD_CREATE;
      } catch (e) {
        state.step = MASTER_PASSWORD_CHECK_SHARED;
      }
    }

    return this.setState(state);
  }

  async onFinishMasterPassword(publicKey, encryptedPrivateKey, masterPassword) {
    const { onFinish } = this.props;

    await postKeys({
      publicKey,
      encryptedPrivateKey,
    });

    onFinish({
      publicKey,
      encryptedPrivateKey,
      masterPassword,
    });
  }

  handleSubmitSharedPassword = async (
    { password },
    { setSubmitting, setErrors },
  ) => {
    const { isAnonymous } = this.props;
    const { publicKey, encryptedPrivateKey } = this.state;

    try {
      await validateKeys(password, encryptedPrivateKey);

      return isAnonymous
        ? this.onFinishMasterPassword(publicKey, encryptedPrivateKey, password)
        : this.setState({
            step: MASTER_PASSWORD_CREATE,
            sharedMasterPassword: password,
          });
    } catch (e) {
      setErrors({ password: 'Wrong password' });
      return setSubmitting(false);
    }
  };

  handleSubmitCheckPassword = async (
    { password },
    { setSubmitting, setErrors },
  ) => {
    const { onFinish } = this.props;
    const { publicKey, encryptedPrivateKey } = this.state;

    try {
      await validateKeys(password, encryptedPrivateKey);

      onFinish({ publicKey, encryptedPrivateKey, masterPassword: password });
    } catch (error) {
      setErrors({ password: 'Wrong password' });
      setSubmitting(false);
    }
  };

  handleSubmitCreatePassword = ({ password }) => {
    this.setState({
      masterPassword: password,
      step: MASTER_PASSWORD_CONFIRM,
    });
  };

  handleSubmitConfirmPassword = async (
    { confirmPassword },
    { setSubmitting, setErrors },
  ) => {
    const { initialStep } = this.props;
    const { sharedMasterPassword } = this.state;

    const {
      masterPassword,
      publicKey: currentPublicKey,
      encryptedPrivateKey: currentEncryptedPrivateKey,
    } = this.state;

    let publicKey = currentPublicKey;
    let encryptedPrivateKey = currentEncryptedPrivateKey;

    try {
      if (initialStep === MASTER_PASSWORD_CHECK_SHARED) {
        if (!currentEncryptedPrivateKey || !sharedMasterPassword) {
          throw new Error(`
            Master Password step: incorrect behaviour, because for reencryption 
            private key requires shared master password and private key
          `);
        }

        encryptedPrivateKey = await reencryptPrivateKey(
          sharedMasterPassword,
          masterPassword,
          currentEncryptedPrivateKey,
        );
      } else {
        const data = await generateKeys(confirmPassword);

        // eslint-disable-next-line
        publicKey = data.publicKey;
        encryptedPrivateKey = data.privateKey;
      }

      return this.onFinishMasterPassword(
        publicKey,
        encryptedPrivateKey,
        masterPassword,
      );
    } catch (error) {
      setErrors({ confirmPassword: 'Something wrong' });
      return setSubmitting(false);
    }
  };

  handleClickReturn = () => {
    this.setState({
      step: MASTER_PASSWORD_CREATE,
    });
  };

  prepareInitialState() {
    return {
      step: null,
      publicKey: null,
      encryptedPrivateKey: null,
      masterPassword: null,
      sharedMasterPassword: this.props.sharedMasterPassword,
    };
  }

  render() {
    const { step, masterPassword } = this.state;

    const renderedStep = matchStrict(
      step,
      {
        [MASTER_PASSWORD_CHECK_SHARED]: (
          <MasterPasswordSharedForm
            onSubmit={this.handleSubmitSharedPassword}
          />
        ),
        [MASTER_PASSWORD_CREATE]: (
          <MasterPasswordCreateForm
            onSubmit={this.handleSubmitCreatePassword}
          />
        ),
        [MASTER_PASSWORD_CONFIRM]: (
          <MasterPasswordConfirmForm
            masterPassword={masterPassword}
            onClickReturn={this.handleClickReturn}
            onSubmit={this.handleSubmitConfirmPassword}
          />
        ),
      },
      null,
    );

    return step === MASTER_PASSWORD_CHECK ? (
      <MasterPasswordCheckForm onSubmit={this.handleSubmitCheckPassword} />
    ) : (
      <AuthLayout>
        <InnerWrapper>{renderedStep}</InnerWrapper>
      </AuthLayout>
    );
  }
}

export default MasterPasswordStep;
