import React, { useState, memo } from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import styled from 'styled-components';
import copy from 'copy-text-to-clipboard';
import { getKeys, postKeys } from '@caesar/common/api';
import { useNotification } from '@caesar/common/hooks';
import { matchStrict } from '@caesar/common/utils/match';
import {
  validateKeys,
  generateKeys,
  reencryptPrivateKey,
} from '@caesar/common/utils/key';
import { waitIdle } from '@caesar/common/utils/utils';
import { setFaviconTag } from '@caesar/common/utils/domUtils';
import { Head, BootstrapLayout } from '@caesar/components';
import { NavigationPanelStyled } from '../../components';
import {
  MASTER_PASSWORD_CHECK,
  MASTER_PASSWORD_CREATE,
  MASTER_PASSWORD_CONFIRM,
} from '../../constants';
import MasterPasswordCheckForm from './MasterPasswordCheckForm';
import MasterPasswordCreateForm from './MasterPasswordCreateForm';
import MasterPasswordConfirmForm from './MasterPasswordConfirmForm';

const Wrapper = styled.div`
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
`;

const isSameKeyPair = (oldKeyPair, currentKeyPair) =>
  oldKeyPair.publicKey === currentKeyPair.publicKey &&
  oldKeyPair.encryptedPrivateKey === currentKeyPair.encryptedPrivateKey;

const MasterPasswordStep = ({
  initialStep,
  navigationSteps,
  user,
  masterPassword: masterPasswordProp,
  sharedMasterPassword,
  onFinish,
}) => {
  const notification = useNotification();
  const [state, setState] = useState({
    step: null,
    publicKey: null,
    encryptedPrivateKey: null,
    masterPassword: masterPasswordProp || '',
    sharedMasterPassword,
  });

  const onFinishMasterPassword = async ({
    oldKeyPair,
    currentKeyPair,
    masterPassword,
  }) => {
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
  };

  useEffectOnce(() => {
    async function generateMasterPasswordState() {
      const initState = {
        step: initialStep,
        publicKey: null,
        encryptedPrivateKey: null,
        masterPassword: masterPasswordProp,
      };

      if (initialStep === MASTER_PASSWORD_CREATE) {
        // it's readonly situation and new invited user
        if (sharedMasterPassword) {
          const {
            data: { publicKey, encryptedPrivateKey },
          } = await getKeys();

          initState.publicKey = publicKey;
          initState.encryptedPrivateKey = encryptedPrivateKey;
        }
      }

      if (initialStep === MASTER_PASSWORD_CHECK) {
        const {
          data: { publicKey, encryptedPrivateKey },
        } = await getKeys();

        initState.publicKey = publicKey;
        initState.encryptedPrivateKey = encryptedPrivateKey;

        const currentMasterPassword =
          sharedMasterPassword || initState.masterPassword || null;

        // it's anonymous situation
        if (currentMasterPassword) {
          try {
            await validateKeys(
              currentMasterPassword,
              initState.encryptedPrivateKey,
            );

            return onFinishMasterPassword({
              currentKeyPair: {
                publicKey: initState.publicKey,
                encryptedPrivateKey: initState.encryptedPrivateKey,
              },
              masterPassword: currentMasterPassword,
            });
          } catch (e) {
            initState.step = MASTER_PASSWORD_CHECK;
          }
        }
      }

      return setState({ ...state, ...initState });
    }

    generateMasterPasswordState();

    return () => {
      setFaviconTag('/public/images/favicon/favicon.ico');
    };
  });

  useUpdateEffect(() => {
    if (state.step === MASTER_PASSWORD_CHECK) {
      setFaviconTag('/public/images/favicon/favicon-locked.ico');
    }
  }, [state.step]);

  const handleSubmitCreatePassword = ({ password }) => {
    copy(password);
    notification.show({
      text: 'Master Password has been copied to clipboard!',
    });

    setState({
      ...state,
      masterPassword: password,
      step: MASTER_PASSWORD_CONFIRM,
    });
  };

  const handleSubmitConfirmPassword = async (
    { confirmPassword },
    { setSubmitting, setErrors },
  ) => {
    const {
      masterPassword,
      publicKey: currentPublicKey,
      encryptedPrivateKey: currentEncryptedPrivateKey,
    } = state;

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

      return onFinishMasterPassword({
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
      // eslint-disable-next-line no-console
      console.error('error', error);
      setErrors({ confirmPassword: 'Something wrong' });

      return setSubmitting(false);
    }
  };

  const handleSubmitCheckPassword = async (
    { password },
    { setSubmitting, setErrors },
  ) => {
    const { publicKey, encryptedPrivateKey } = state;

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

  const handleClickReturn = () => {
    setState({
      ...state,
      step: MASTER_PASSWORD_CREATE,
    });
  };

  if (!state.step) {
    return null;
  }

  const renderedStep = matchStrict(
    state.step,
    {
      [MASTER_PASSWORD_CREATE]: (
        <MasterPasswordCreateForm
          initialValues={{
            password: state.masterPassword,
          }}
          onSubmit={handleSubmitCreatePassword}
        />
      ),
      [MASTER_PASSWORD_CONFIRM]: (
        <MasterPasswordConfirmForm
          masterPassword={state.masterPassword}
          onClickReturn={handleClickReturn}
          onSubmit={handleSubmitConfirmPassword}
        />
      ),
    },
    null,
  );

  return (
    <>
      <Head title="Master Password" />
      {state.step === MASTER_PASSWORD_CHECK ? (
        <MasterPasswordCheckForm
          user={user}
          onSubmit={handleSubmitCheckPassword}
        />
      ) : (
        <BootstrapLayout user={user}>
          <NavigationPanelStyled
            currentStep={state.step}
            steps={navigationSteps}
          />
          <Wrapper>{renderedStep}</Wrapper>
        </BootstrapLayout>
      )}
    </>
  );
};

export default memo(MasterPasswordStep);
