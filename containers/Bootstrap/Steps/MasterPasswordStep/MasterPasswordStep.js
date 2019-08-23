import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import copy from 'copy-text-to-clipboard';
import { getKeys, postKeys } from 'common/api';
import { matchStrict } from 'common/utils/match';
import {
  validateKeys,
  generateKeys,
  reencryptPrivateKey,
} from 'common/utils/key';
import { Head, BootstrapLayout } from 'components';
import { NavigationPanelStyled } from '../../components';
import {
  MASTER_PASSWORD_CHECK,
  MASTER_PASSWORD_CREATE,
  MASTER_PASSWORD_CONFIRM,
} from '../../constants';
import MasterPasswordCheckForm from './MasterPasswordCheckForm';
import MasterPasswordCreateForm from './MasterPasswordCreateForm';
import MasterPasswordConfirmForm from './MasterPasswordConfirmForm';

const isSameKeyPair = (oldKeyPair, currentKeyPair) =>
  oldKeyPair.publicKey === currentKeyPair.publicKey &&
  oldKeyPair.encryptedPrivateKey === currentKeyPair.encryptedPrivateKey;

const Wrapper = styled.div`
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
`;

const waitIdle = () => new Promise(requestIdleCallback);

class MasterPasswordStep extends Component {
  state = this.prepareInitialState();

  async componentDidMount() {
    const { initialStep, sharedMasterPassword } = this.props;

    const state = {
      step: initialStep,
      publicKey: null,
      encryptedPrivateKey: null,
      masterPassword: '',
    };

    if (initialStep === MASTER_PASSWORD_CREATE) {
      // it's readonly situation and new invited user
      if (sharedMasterPassword) {
        const {
          data: { publicKey, encryptedPrivateKey },
        } = await getKeys();

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

          return this.onFinishMasterPassword({
            currentKeyPair: {
              publicKey: state.publicKey,
              encryptedPrivateKey: state.encryptedPrivateKey,
            },
            masterPassword: sharedMasterPassword,
          });
        } catch (e) {
          state.step = MASTER_PASSWORD_CHECK;
        }
      }
    }

    return this.setState(state);
  }

  async onFinishMasterPassword({ oldKeyPair, currentKeyPair, masterPassword }) {
    const { onFinish } = this.props;

    if (oldKeyPair && !isSameKeyPair(oldKeyPair, currentKeyPair)) {
      await postKeys({
        publicKey: currentKeyPair.publicKey,
        encryptedPrivateKey: currentKeyPair.encryptedPrivateKey,
      });
    }

    onFinish({
      oldKeyPair,
      currentKeyPair,
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

      onFinish({
        currentKeyPair: { publicKey, encryptedPrivateKey },
        masterPassword: password,
      });
    } catch (error) {
      setErrors({ password: 'Wrong password' });
      setSubmitting(false);
    }
  };

  handleSubmitCreatePassword = ({ password }) => {
    this.setState(
      {
        masterPassword: password,
        step: MASTER_PASSWORD_CONFIRM,
      },
      () => copy(password),
    );
  };

  handleSubmitConfirmPassword = async (
    { confirmPassword },
    { setSubmitting, setErrors },
  ) => {
    const { sharedMasterPassword, user } = this.props;

    const {
      masterPassword,
      publicKey: currentPublicKey,
      encryptedPrivateKey: currentEncryptedPrivateKey,
    } = this.state;

    // otherwise, formik doesn't have time to set isSubmitting flag
    await waitIdle();

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
        const data = await generateKeys(confirmPassword, [user.email]);

        // eslint-disable-next-line
        publicKey = data.publicKey;
        encryptedPrivateKey = data.privateKey;
      }

      return this.onFinishMasterPassword({
        oldKeyPair: {
          publicKey: currentPublicKey,
          encryptedPrivateKey: currentEncryptedPrivateKey,
        },
        currentKeyPair: {
          publicKey,
          encryptedPrivateKey,
        },
        masterPassword,
      });
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
      masterPassword: '',
      sharedMasterPassword: this.props.sharedMasterPassword,
    };
  }

  render() {
    const { navigationSteps, user } = this.props;
    const { step, masterPassword } = this.state;

    if (!step) {
      return null;
    }

    const initialValues = {
      password: masterPassword,
    };

    const renderedStep = matchStrict(
      step,
      {
        [MASTER_PASSWORD_CREATE]: (
          <MasterPasswordCreateForm
            initialValues={initialValues}
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

    return (
      <Fragment>
        <Head title="Master Password" />
        {step === MASTER_PASSWORD_CHECK ? (
          <MasterPasswordCheckForm onSubmit={this.handleSubmitCheckPassword} />
        ) : (
          <BootstrapLayout user={user}>
            <NavigationPanelStyled currentStep={step} steps={navigationSteps} />
            <Wrapper>{renderedStep}</Wrapper>
          </BootstrapLayout>
        )}
      </Fragment>
    );
  }
}

export default MasterPasswordStep;
