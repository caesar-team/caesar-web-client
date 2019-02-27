import React, { Component } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { getKeys, postKeys } from 'common/api';
import { matchStrict } from 'common/utils/match';
import {
  validateKeys,
  generateKeys,
  reencryptPrivateKey,
} from 'common/utils/key';
import { WrapperAlignTop, BootstrapWrapper } from 'components';
import {
  MASTER_PASSWORD_CHECK,
  MASTER_PASSWORD_CREATE,
  MASTER_PASSWORD_CONFIRM,
} from '../../constants';
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
    const { initialStep, sharedMasterPassword } = this.props;

    const state = {
      step: initialStep,
      publicKey: null,
      encryptedPrivateKey: null,
      masterPassword: null,
    };

    if (initialStep === MASTER_PASSWORD_CREATE) {
      // it's readonly situation
      if (sharedMasterPassword) {
        const {
          data: { publicKey, encryptedPrivateKey },
        } = await getKeys();

        Cookies.remove('share', { path: '/' });

        state.publicKey = publicKey;
        state.encryptedPrivateKey = encryptedPrivateKey;
      }
    }

    if (initialStep === MASTER_PASSWORD_CHECK) {
      const {
        data: { publicKey, encryptedPrivateKey },
      } = await getKeys();

      state.publicKey = publicKey;
      state.encryptedPrivateKey = encryptedPrivateKey;

      // it's anonymous situation
      if (sharedMasterPassword) {
        try {
          await validateKeys(sharedMasterPassword, state.encryptedPrivateKey);

          return this.onFinishMasterPassword(
            state.publicKey,
            state.encryptedPrivateKey,
            sharedMasterPassword,
          );
        } catch (e) {
          state.step = MASTER_PASSWORD_CHECK;
        }
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
    const { sharedMasterPassword } = this.props;

    const {
      masterPassword,
      publicKey: currentPublicKey,
      encryptedPrivateKey: currentEncryptedPrivateKey,
    } = this.state;

    let publicKey = currentPublicKey;
    let encryptedPrivateKey = currentEncryptedPrivateKey;

    try {
      if (sharedMasterPassword) {
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
      <BootstrapWrapper>
        <InnerWrapper>{renderedStep}</InnerWrapper>
      </BootstrapWrapper>
    );
  }
}

export default MasterPasswordStep;
