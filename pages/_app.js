import React from 'react';
// eslint-disable-next-line
import { default as NextApp, Container } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import * as openpgp from 'openpgp';
import globalStyles from 'common/styles/globalStyles';
import { entryResolver } from 'common/utils/entryResolver';
import { DEFAULT_IDLE_TIMEOUT } from 'common/constants';
import OpenPGPWorker from 'common/openpgp.worker';
import { generateKeys, validateKeys } from 'common/utils/key';
import { getKeys, postKeys } from 'common/api';
import theme from 'common/theme';
import { SessionChecker, Loader, NotificationProvider } from '../components';
import { MasterPassword, Lock } from '../containers';

const GlobalStyles = createGlobalStyle`${globalStyles}`;

export default class App extends NextApp {
  state = this.prepareInitialState();

  worker = null;

  publicKey = null;

  privateKey = null;

  password = null;

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.router.route === '/2fa') return { shouldShowLoader: false };
    return null;
  }

  static async getInitialProps({ Component, router, ctx }) {
    entryResolver({ router, ctx });
    return Component.getInitialProps
      ? {
          pageProps: await Component.getInitialProps(ctx),
        }
      : {};
  }

  async componentDidMount() {
    if (this.props.router.route !== '/auth') {
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

    this.privateKey = null;
    this.publicKey = publicKey;
    this.encryptedPrivateKey = encryptedPrivateKey;

    const isFullWorkflow = !publicKey || !encryptedPrivateKey;

    this.setState({
      isFullWorkflow,
      shouldShowLoader: false,
      shouldShowMasterPassword: true,
    });
    callback();
  };

  async generateKeys(password, { setSubmitting, setErrors }) {
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
        shouldShowMasterPassword: false,
        isFullWorkflow: false,
      });
    } catch (error) {
      setErrors({ password: 'Something wrong' });
      setSubmitting(false);
    }
  }

  async validateKeys(password, { setSubmitting, setErrors }) {
    try {
      await validateKeys(password, this.encryptedPrivateKey);

      this.privateKey = this.encryptedPrivateKey;
      this.password = password;

      this.setState({
        shouldShowMasterPassword: false,
        isFullWorkflow: false,
      });
    } catch (error) {
      setErrors({ password: 'Wrong password' });
      setSubmitting(false);
    }
  }

  handleSubmit = async ({ password }, FormikBag) => {
    const { isFullWorkflow } = this.state;

    // eslint-disable-next-line
    (await isFullWorkflow)
      ? this.generateKeys(password, FormikBag)
      : this.validateKeys(password, FormikBag);
  };

  handleInactiveTimeout = () => {
    this.setState({
      shouldShowMasterPassword: true,
    });
  };

  prepareInitialState() {
    const { router } = this.props;

    return {
      isError: false,
      isFullWorkflow: true,
      shouldShowLoader: router.route !== '/auth' && router.route !== '/2fa',
      shouldShowMasterPassword: false,
    };
  }

  render() {
    const {
      isFullWorkflow,
      shouldShowMasterPassword,
      shouldShowLoader,
    } = this.state;
    const { Component, pageProps, router } = this.props;

    if (shouldShowLoader) {
      return <Loader />;
    }

    const shouldShowMasterPasswordWorkflow =
      router.route !== '/auth' && shouldShowMasterPassword;

    if (shouldShowMasterPasswordWorkflow) {
      return (
        <ThemeProvider theme={theme}>
          <Container>
            <GlobalStyles />
            {isFullWorkflow ? (
              <MasterPassword onSubmit={this.handleSubmit} />
            ) : (
              <Lock onSubmit={this.handleSubmit} />
            )}
          </Container>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <Container>
            <GlobalStyles />
            <SessionChecker
              timeout={DEFAULT_IDLE_TIMEOUT}
              onFinishTimeout={this.handleInactiveTimeout}
            >
              <Component
                privateKey={this.privateKey}
                publicKey={this.publicKey}
                password={this.password}
                initialize={this.initWorkflow}
                {...pageProps}
              />
            </SessionChecker>
          </Container>
        </NotificationProvider>
      </ThemeProvider>
    );
  }
}
