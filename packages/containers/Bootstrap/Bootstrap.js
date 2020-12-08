import React, { Component } from 'react';
import * as openpgp from 'openpgp';
import { withRouter } from 'next/router';
import { getUserBootstrap, getUserSelf } from '@caesar/common/api';
import { normalizeCurrentUser } from '@caesar/common/normalizers/normalizers';
import {
  DEFAULT_IDLE_TIMEOUT,
  NOOP_NOTIFICATION,
  IS_PROD,
  DOMAIN_ROLES,
} from '@caesar/common/constants';
import {
  SessionChecker,
  FullScreenLoader,
  BootstrapLayout,
  GlobalNotification,
} from '@caesar/components';
// import OpenPGPWorker from 'openpgp/dist/openpgp.worker';
// eslint-disable-next-line import/no-webpack-loader-syntax
import OpenPGPWorker from 'worker-loader!openpgp/dist/openpgp.worker';
import { isClient } from '@caesar/common/utils/isEnvironment';
import { logger } from '@caesar/common/utils/logger';
import { getBootstrapStates, getNavigationPanelSteps } from './utils';
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

class Bootstrap extends Component {
  state = this.prepareInitialState();

  worker = null;

  bootstrap = null;

  constructor(props) {
    super(props);
    // we don't need initialize it in componentDidMound
    // because openpgp must be initialized before children component will be
    // initialized via componentDidMount
    if (isClient) {
      this.initOpenPGP();
    }
  }

  async componentDidMount() {
    const {
      logout,
      fetchUserSelfSuccess,
      initCoresCount,
      shared = {},
    } = this.props;
    initCoresCount();

    try {
      const { data: bootstrap } = await getUserBootstrap();
      const { data: currentUser } = await getUserSelf();
      const isAnonymousOrReadOnlyUser =
        currentUser?.domainRoles?.includes(DOMAIN_ROLES.ROLE_ANONYMOUS_USER) ||
        currentUser?.domainRoles?.includes(DOMAIN_ROLES.ROLE_READ_ONLY_USER);

      if (!currentUser || (isAnonymousOrReadOnlyUser && !shared?.m)) {
        logout();
      }

      fetchUserSelfSuccess(normalizeCurrentUser(currentUser));

      this.bootstrap = getBootstrapStates(bootstrap);
      this.navigationPanelSteps = getNavigationPanelSteps(this.bootstrap);
      this.currentUser = currentUser;

      this.setState({
        currentStep: this.currentStepResolver(bootstrap),
      });
    } catch (e) {
      logger.error(`Bootstrap failure`, e);
    }
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

  handleFinishMasterPassword = ({ currentKeyPair, masterPassword }) => {
    this.props.setMasterPassword(masterPassword);
    this.props.setKeyPair({
      publicKey: currentKeyPair.publicKey,
      privateKey: currentKeyPair.encryptedPrivateKey,
      password: masterPassword,
    });

    this.setState({
      currentKeyPair,
      masterPassword,
      currentStep: BOOTSTRAP_FINISH,
    });
  };

  handleInactiveTimeout = () => {
    this.props.resetWorkflowState();
    this.props.removeItemsData();

    this.setState({
      currentStep: MASTER_PASSWORD_CHECK,
    });
  };

  handleCloseNotification = () => {
    this.props.updateGlobalNotification(NOOP_NOTIFICATION, false);
  };

  initOpenPGP() {
    const worker = new OpenPGPWorker();

    // eslint-disable-next-line camelcase
    openpgp.config.aead_protect = false;
    openpgp.initWorker({ workers: [worker] });
  }

  currentStepResolver(bootstrap) {
    const {
      twoFactorAuthState,
      passwordState,
      masterPasswordState,
    } = getBootstrapStates(bootstrap);

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
      masterPassword: null,
      currentKeyPair: {
        publicKey: null,
        encryptedPrivateKey: null,
      },
    };
  }

  render() {
    const {
      isLoadingGlobalNotification,
      isErrorGlobalNotification,
      globalNotificationText,
      component: PageComponent,
      router,
      shared = {},
      updateGlobalNotification,
      ...props
    } = this.props;
    const { currentStep, currentKeyPair, masterPassword } = this.state;

    if (!currentStep) {
      return <FullScreenLoader />;
    }

    const shouldShowGlobalNotification =
      isLoadingGlobalNotification || isErrorGlobalNotification;

    if (TWO_FACTOR_STEPS.includes(currentStep)) {
      return (
        <BootstrapLayout currentUser={this.currentUser}>
          <TwoFactorStep
            initialStep={currentStep}
            navigationSteps={this.navigationPanelSteps}
            onFinish={this.handleFinishTwoFactor}
          />
        </BootstrapLayout>
      );
    }

    if (PASSWORD_STEPS.includes(currentStep)) {
      return (
        <BootstrapLayout currentUser={this.currentUser}>
          <PasswordStep
            email={shared.e}
            navigationSteps={this.navigationPanelSteps}
            onFinish={this.handleFinishChangePassword}
          />
        </BootstrapLayout>
      );
    }

    if (MASTER_PASSWORD_STEPS.includes(currentStep)) {
      return (
        <MasterPasswordStep
          initialStep={currentStep}
          navigationSteps={this.navigationPanelSteps}
          currentUser={this.currentUser}
          sharedMasterPassword={shared.m}
          masterPassword={IS_PROD ? null : this.props.masterPassword}
          onFinish={this.handleFinishMasterPassword}
        />
      );
    }

    // if user is using sharing url and master password is included inside share
    // url we don't turn on LockScreen via SessionChecker(onFinishTimeout)
    if (currentStep === BOOTSTRAP_FINISH && shared.m) {
      return (
        <PageComponent
          publicKey={currentKeyPair.publicKey}
          privateKey={currentKeyPair.encryptedPrivateKey}
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
            publicKey={currentKeyPair.publicKey}
            privateKey={currentKeyPair.encryptedPrivateKey}
            password={masterPassword}
            {...props}
          />
          {shouldShowGlobalNotification && (
            <GlobalNotification
              text={globalNotificationText}
              isError={isErrorGlobalNotification}
              onClose={this.handleCloseNotification}
            />
          )}
        </SessionChecker>
      )
    );
  }
}

export default withRouter(Bootstrap);
