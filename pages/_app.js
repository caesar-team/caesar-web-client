import React from 'react';
// eslint-disable-next-line
import { default as NextApp, Container } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import * as openpgp from 'openpgp';
import globalStyles from 'common/styles/globalStyles';
import { entryResolver } from 'common/utils/entryResolver';
import {
  CHECK_MASTER_PASSWORD_FLOW,
  CREATE_MASTER_PASSWORD_FLOW,
  SHARED_FLOW,
} from 'common/constants';
import OpenPGPWorker from 'common/openpgp.worker';
import {
  generateKeys,
  validateKeys,
  reencryptPrivateKey,
} from 'common/utils/key';
import { getToken } from 'common/utils/token';
import { base64ToObject } from 'common/utils/cipherUtils';
import { getKeys, postKeys, getUserSelf, getUserBootstrap } from 'common/api';
import theme from 'common/theme';
import { createAbility } from 'common/ability';
import { Loader, NotificationProvider, AbilityProvider } from '../components';
import { MasterPassword, Lock, Bootstrap } from '../containers';

const GlobalStyles = createGlobalStyle`${globalStyles}`;

export default class App extends NextApp {
  state = this.prepareInitialState();

  worker = null;

  publicKey = null;

  privateKey = null;

  password = null;

  encryptedPrivateKey = null;

  sharedMasterPassword = null;

  isSharedEntrance = false;

  user = null;

  static async getInitialProps({ Component, router, ctx }) {
    entryResolver({ router, ctx });

    let bootstrap = {};

    if (router.route !== '/share' && router.route !== '/auth') {
      const token = ctx.req.cookies ? ctx.req.cookies.token : getToken();

      const { data } = await getUserBootstrap(token);

      bootstrap = data;
    }

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps: { bootstrap, ...pageProps } };
  }

  async componentDidMount() {
    const {
      router: { route },
      pageProps,
    } = this.props;

    const isSharing = route === '/share' && pageProps.encryption;
    const canLaunchWorkflow = !['/auth', '/share'].includes(route);

    if (isSharing) {
      this.isSharedEntrance = true;

      const encryption = base64ToObject(pageProps.encryption);

      this.sharedMasterPassword = encryption.masterPassword || null;
    }

    if (canLaunchWorkflow) {
      this.initOpenPGPWorker();
      await this.initWorkflow();
    }
  }

  initOpenPGPWorker() {
    openpgp.config.aead_protect = false;

    this.worker = new OpenPGPWorker();

    openpgp.initWorker({ workers: [this.worker] });
  }

  initWorkflow = async (callback = Function.prototype) => {
    const {
      data: { publicKey, encryptedPrivateKey },
    } = await getKeys();
    const { data: user } = await getUserSelf(getToken());

    this.user = user;

    this.privateKey = null;
    this.publicKey = publicKey;
    this.encryptedPrivateKey = encryptedPrivateKey;

    this.setState(
      {
        shouldShowLoader: false,
        flow: this.getFlow(),
        shouldShowPasswordFlow: true,
      },
      callback,
    );
  };

  getFlow() {
    if (this.isSharedEntrance) {
      return SHARED_FLOW;
    }

    if (!this.publicKey || !this.encryptedPrivateKey) {
      return CREATE_MASTER_PASSWORD_FLOW;
    }

    return CHECK_MASTER_PASSWORD_FLOW;
  }

  handleSubmitCheckSharedPassword = async (
    { password },
    { setSubmitting, setErrors },
    callback = Function.prototype,
  ) => {
    try {
      await validateKeys(password, this.encryptedPrivateKey);

      this.sharedMasterPassword = password;
      this.privateKey = this.encryptedPrivateKey;

      callback();
    } catch (error) {
      setErrors({ checkPassword: 'Wrong password' });
      setSubmitting(false);
    }
  };

  handleSubmitShareFlow = async (
    { password },
    { setSubmitting, setErrors },
  ) => {
    try {
      const encryptedPrivateKey = await reencryptPrivateKey(
        this.sharedMasterPassword,
        password,
        this.privateKey,
      );

      await postKeys({
        publicKey: this.publicKey,
        encryptedPrivateKey,
      });

      this.password = password;
      this.privateKey = encryptedPrivateKey;

      this.setState({
        shouldShowPasswordFlow: false,
      });
    } catch (error) {
      setErrors({ checkPassword: 'Wrong password' });
      setSubmitting(false);
    }
  };

  handleSubmitCreationFlow = async (
    { password },
    { setSubmitting, setErrors },
  ) => {
    const { publicKey, privateKey } = await generateKeys(password);

    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.password = password;

    try {
      await postKeys({
        publicKey,
        encryptedPrivateKey: privateKey,
      });

      this.setState({
        shouldShowPasswordFlow: false,
      });
    } catch (error) {
      setErrors({ password: 'Something wrong' });
      setSubmitting(false);
    }
  };

  handleSubmitCheckPassword = async (
    { password },
    { setSubmitting, setErrors },
  ) => {
    try {
      await validateKeys(password, this.encryptedPrivateKey);

      this.privateKey = this.encryptedPrivateKey;
      this.password = password;

      this.setState({
        shouldShowPasswordFlow: false,
      });
    } catch (error) {
      setErrors({ password: 'Wrong password' });
      setSubmitting(false);
    }
  };

  prepareInitialState() {
    const {
      router: { route },
    } = this.props;

    return {
      isError: false,
      shouldShowLoader: !['/auth', '/share'].includes(route),
      flow: CHECK_MASTER_PASSWORD_FLOW,
      shouldShowPasswordFlow: false,
    };
  }

  renderSharedFlow() {
    return (
      <MasterPassword
        checkPassword={this.sharedMasterPassword}
        flow={SHARED_FLOW}
        onSubmitCheckSharedPassword={this.handleSubmitCheckSharedPassword}
        onSubmit={this.handleSubmitShareFlow}
      />
    );
  }

  renderCreateMasterPasswordFlow() {
    return (
      <MasterPassword
        flow={CREATE_MASTER_PASSWORD_FLOW}
        onSubmit={this.handleSubmitCreationFlow}
      />
    );
  }

  renderCheckPasswordFlow() {
    return <Lock onSubmit={this.handleSubmitCheckPassword} />;
  }

  render() {
    const { shouldShowLoader } = this.state;
    const { Component, pageProps, router } = this.props;

    if (shouldShowLoader) {
      return <Loader />;
    }

    if (router.route === '/auth' || router.route === '/share') {
      return (
        <ThemeProvider theme={theme}>
          <Container>
            <GlobalStyles />
            <Component
              privateKey={this.privateKey}
              publicKey={this.publicKey}
              password={this.password}
              initialize={this.initWorkflow}
              {...pageProps}
            />
          </Container>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <AbilityProvider value={createAbility(this.user)}>
          <NotificationProvider>
            <Container>
              <GlobalStyles />
              <Bootstrap
                {...pageProps.bootstrap}
                sharedMasterPassword={this.sharedMasterPassword}
              >
                <Component
                  privateKey={this.privateKey}
                  publicKey={this.publicKey}
                  password={this.password}
                  initialize={this.initWorkflow}
                  {...pageProps}
                />
              </Bootstrap>
            </Container>
          </NotificationProvider>
        </AbilityProvider>
      </ThemeProvider>
    );
    // if (shouldShowPasswordFlow && router.route !== '/auth') {
    //   const renderedStep = match(
    //     flow,
    //     {
    //       SHARED_FLOW: this.renderSharedFlow(),
    //       CREATE_MASTER_PASSWORD_FLOW: this.renderCreateMasterPasswordFlow(),
    //       CHECK_MASTER_PASSWORD_FLOW: this.renderCheckPasswordFlow(),
    //     },
    //     null,
    //   );
    //
    //   return (
    //     <ThemeProvider theme={theme}>
    //       <Container>
    //         <GlobalStyles />
    //         {renderedStep}
    //       </Container>
    //     </ThemeProvider>
    //   );
    // }
    //
    // if (router.route === '/auth') {
    //   return (
    //     <ThemeProvider theme={theme}>
    //       <Component
    //         privateKey={this.privateKey}
    //         publicKey={this.publicKey}
    //         password={this.password}
    //         initialize={this.initWorkflow}
    //         {...pageProps}
    //       />
    //     </ThemeProvider>
    //   );
    // }
    //
    // return (
    //   <ThemeProvider theme={theme}>
    //     <AbilityProvider value={createAbility(this.user)}>
    //       <NotificationProvider>
    //         <Container>
    //           <GlobalStyles />
    //           <SessionChecker
    //             timeout={DEFAULT_IDLE_TIMEOUT}
    //             onFinishTimeout={this.handleInactiveTimeout}
    //           >
    //             <Component
    //               privateKey={this.privateKey}
    //               publicKey={this.publicKey}
    //               password={this.password}
    //               initialize={this.initWorkflow}
    //               {...pageProps}
    //             />
    //           </SessionChecker>
    //         </Container>
    //       </NotificationProvider>
    //     </AbilityProvider>
    //   </ThemeProvider>
    // );
  }
}
