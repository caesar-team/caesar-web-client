import React from 'react';
// eslint-disable-next-line
import { default as NextApp, Container } from 'next/app';
import * as openpgp from 'openpgp';
import { entryResolver } from 'common/utils/entryResolver';
import { DEFAULT_IDLE_TIMEOUT, LENGTH_KEY } from 'common/constants';
import OpenPGPWorker from 'common/openpgp.worker';
import { uuid4 } from 'common/utils/uuid4';
import { getKeys, postKeys } from 'common/api';
import { SessionChecker, Loader } from '../components';
import { MasterPassword } from '../containers';

export default class App extends NextApp {
  state = this.prepareInitialState();

  worker = null;

  publicKey = null;

  privateKey = null;

  password = null;

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
      this.initWorkflow();
    }
  }

  initOpenPGPWorker() {
    openpgp.config.aead_protect = false;

    this.worker = new OpenPGPWorker();

    openpgp.initWorker({ workers: [this.worker] });
  }

  async initWorkflow() {
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
  }

  async generateKeys(password) {
    const options = {
      userIds: [{ name: uuid4() }],
      numBits: LENGTH_KEY,
      passphrase: password,
    };

    const { publicKeyArmored, privateKeyArmored } = await openpgp.generateKey(
      options,
    );

    this.publicKey = publicKeyArmored;
    this.privateKey = privateKeyArmored;
    this.password = password;

    await postKeys({
      publicKey: publicKeyArmored,
      encryptedPrivateKey: privateKeyArmored,
    });

    this.setState({
      shouldShowMasterPassword: false,
      isFullWorkflow: false,
    });
  }

  async validateKeys(password) {
    try {
      const privateKeyObj = (await openpgp.key.readArmored(
        this.encryptedPrivateKey,
      )).keys[0];

      await privateKeyObj.decrypt(password);

      this.privateKey = this.encryptedPrivateKey;
      this.password = password;

      this.setState({
        shouldShowMasterPassword: false,
        isFullWorkflow: false,
      });
    } catch (error) {
      this.setState({
        isError: true,
      });
    }
  }

  handleSetMasterPassword = async password => {
    const { isFullWorkflow } = this.state;

    // eslint-disable-next-line
    (await isFullWorkflow)
      ? this.generateKeys(password)
      : this.validateKeys(password);
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
      shouldShowLoader: router.route !== '/auth',
      shouldShowMasterPassword: false,
    };
  }

  render() {
    const {
      isError,
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
        <Container>
          <MasterPassword
            isError={isError}
            isFullWorkflow={isFullWorkflow}
            onSetMasterPassword={this.handleSetMasterPassword}
          />
        </Container>
      );
    }

    return (
      <Container>
        <SessionChecker
          timeout={DEFAULT_IDLE_TIMEOUT}
          onFinishTimeout={this.handleInactiveTimeout}
        >
          <Component
            privateKey={this.privateKey}
            publicKey={this.publicKey}
            password={this.password}
            {...pageProps}
          />
        </SessionChecker>
      </Container>
    );
  }
}
