import memoize from 'memoize-one';
import {
  TWO_FACTOR_CREATE,
  TWO_FACTOR_CHECK,
  TWO_FACTOR_BACKUPS,
  PASSWORD_CHANGE,
  MASTER_PASSWORD_CREATE,
  MASTER_PASSWORD_CHECK,
  MASTER_PASSWORD_CONFIRM,
} from './constants';

export const getBootstrapStates = memoize(bootstrap => ({
  twoFactorAuthState: `TWO_FACTOR_${bootstrap.twoFactorAuthState}`,
  passwordState: `PASSWORD_${bootstrap.passwordState}`,
  masterPasswordState: `MASTER_PASSWORD_${bootstrap.masterPasswordState}`,
}));

const createStep = (name, text) => ({ name, text });

const getTwoFactorSteps = twoFactorAuthState => {
  if (twoFactorAuthState === TWO_FACTOR_CREATE) {
    return [
      createStep(TWO_FACTOR_CREATE, '2FA'),
      createStep(TWO_FACTOR_BACKUPS, 'Codes'),
    ];
  }

  if (twoFactorAuthState === TWO_FACTOR_CHECK) {
    return [createStep(TWO_FACTOR_CREATE, '2FA')];
  }

  return [];
};

const getPasswordSteps = passwordState => {
  return passwordState === PASSWORD_CHANGE
    ? [createStep(PASSWORD_CHANGE, 'Change password')]
    : [];
};

const getMasterPasswordSteps = masterPasswordState => {
  if (masterPasswordState === MASTER_PASSWORD_CREATE) {
    return [
      createStep(MASTER_PASSWORD_CREATE, 'Create Master Password'),
      createStep(MASTER_PASSWORD_CONFIRM, 'Confirmation'),
    ];
  }

  if (masterPasswordState === MASTER_PASSWORD_CHECK) {
    return [createStep(MASTER_PASSWORD_CHECK, 'Check Master Password')];
  }

  return [];
};

export const getNavigationPanelSteps = memoize(
  ({ twoFactorAuthState, passwordState, masterPasswordState }) => [
    ...getTwoFactorSteps(twoFactorAuthState),
    ...getPasswordSteps(passwordState),
    ...getMasterPasswordSteps(masterPasswordState),
  ],
);
