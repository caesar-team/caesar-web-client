import React, { Component } from 'react';
import * as openpgp from 'openpgp';
import { withRouter } from 'next/router';
import { getUserBootstrap, getUserSelf } from '@caesar/common/api';
import {
  DEFAULT_IDLE_TIMEOUT,
  NOOP_NOTIFICATION,
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
  SHARED_ITEMS_CHECK,
  SHARED_ITEMS_SKIP,
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
    const { logout, initCoresCount } = this.props;
    initCoresCount();

    try {
      const { shared = {}, logout } = this.props;
      const { data: bootstrap } = await getUserBootstrap();
      const { data: user } = await getUserSelf();

      // TODO: Add namespaces into JWT token to avoid this dirty hack
      if (!user || (user?.email.includes('anonymous') && !shared?.mp)) {
        logout();
      }

      this.bootstrap = getBootstrapStates(bootstrap);
      this.navigationPanelSteps = getNavigationPanelSteps(this.bootstrap);
      this.user = user;

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

  handleFinishMasterPassword = ({
    oldKeyPair,
    currentKeyPair,
    masterPassword,
  }) => {
    const { sharedItemsState } = this.bootstrap;

    this.props.setMasterPassword(masterPassword);
    this.props.setKeyPair({
      publicKey: currentKeyPair.publicKey,
      privateKey: currentKeyPair.encryptedPrivateKey,
    });

    this.setState({
      oldKeyPair,
      currentKeyPair,
      masterPassword,
      currentStep:
        sharedItemsState === SHARED_ITEMS_CHECK
          ? SHARED_ITEMS_CHECK
          : BOOTSTRAP_FINISH,
    });
  };

  handleFinishSharedItems = () => {
    this.bootstrap.sharedItemsState = SHARED_ITEMS_SKIP;

    this.setState({
      currentStep: BOOTSTRAP_FINISH,
    });
  };

  handleInactiveTimeout = () => {
    this.props.resetWorkflowStore();
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
      sharedItemsState,
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

    if (SHARED_ITEMS_STEPS.includes(sharedItemsState)) {
      return sharedItemsState;
    }

    return MASTER_PASSWORD_CHECK;
  }

  prepareInitialState() {
    return {
      currentStep: null,
      masterPassword: null,
      oldKeyPair: {
        publicKey: null,
        encryptedPrivateKey: null,
      },
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
    const {
      currentStep,
      oldKeyPair,
      currentKeyPair,
      masterPassword,
    } = this.state;

    if (!currentStep) {
      return <FullScreenLoader />;
    }

    const shouldShowGlobalNotification =
      isLoadingGlobalNotification || isErrorGlobalNotification;

    if (TWO_FACTOR_STEPS.includes(currentStep)) {
      return (
        <BootstrapLayout user={this.user}>
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
        <BootstrapLayout user={this.user}>
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
          user={this.user}
          sharedMasterPassword={shared.mp}
          onFinish={this.handleFinishMasterPassword}
        />
      );
    }

    if (SHARED_ITEMS_STEPS.includes(currentStep)) {
      return (
        <>
          <BootstrapLayout user={this.user}>
            <SharedItemsStep
              navigationSteps={this.navigationPanelSteps}
              oldKeyPair={oldKeyPair}
              currentKeyPair={currentKeyPair}
              oldMasterPassword={shared.mp}
              currentMasterPassword={masterPassword}
              onFinish={this.handleFinishSharedItems}
              updateGlobalNotification={updateGlobalNotification}
            />
          </BootstrapLayout>
          {shouldShowGlobalNotification && (
            <GlobalNotification
              text={globalNotificationText}
              isError={isErrorGlobalNotification}
              onClose={this.handleCloseNotification}
            />
          )}
        </>
      );
    }

    // if user is using sharing url and master password is included inside share
    // url we don't turn on LockScreen via SessionChecker(onFinishTimeout)
    if (currentStep === BOOTSTRAP_FINISH && shared.mp) {
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
