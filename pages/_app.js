import React from 'react';
// eslint-disable-next-line
import { default as NextApp, Container } from 'next/app';
import NodeRSA from 'node-rsa';
import openpgp, { message } from 'openpgp';
import { entryResolver } from 'common/utils/entryResolver';
import { DEFAULT_IDLE_TIMEOUT, LENGTH_KEY } from 'common/constants';
import { getKeys, postKeys } from 'common/api';
import { SessionChecker, Loader } from '../components';
import { MasterPassword } from '../containers';

export default class App extends NextApp {
  state = this.prepareInitialState();

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
      const {
        data: { publicKey, encryptedPrivateKey },
      } = await getKeys();

      this.privateKey = null;
      this.publicKey = publicKey;
      this.encryptedPrivateKey = encryptedPrivateKey;

      const isFullWorkflow = !publicKey || !encryptedPrivateKey;

      const isSetPassword =
        sessionStorage.getItem('isSetPassword') &&
        sessionStorage.getItem('isSetPassword') === '1';

      this.setState({
        isFullWorkflow,
        shouldShowLoader: false,
        shouldShowMasterPassword: !isSetPassword,
      });
    }
  }

  async generateKeys(password) {
    const key = new NodeRSA({ b: LENGTH_KEY });

    const options = {
      message: message.fromText(key.exportKey('private')),
      passwords: password,
    };

    const encrypted = await openpgp.encrypt(options);
    const encryptedPrivateKey = encrypted.data;

    await postKeys({
      encryptedPrivateKey,
      publicKey: key.exportKey('public'),
    });

    this.setState(
      {
        shouldShowMasterPassword: false,
        isFullWorkflow: false,
      },
      () => {
        sessionStorage.setItem('isSetPassword', '1');
      },
    );
  }

  async validateKeys(password) {
    try {
      const decryptedSessionKeys = await openpgp.decryptSessionKeys({
        message: await message.readArmored(this.encryptedPrivateKey),
        passwords: password,
      });
      const decrypted = await openpgp.decrypt({
        sessionKeys: decryptedSessionKeys[0],
        message: await message.readArmored(this.encryptedPrivateKey),
      });

      this.privateKey = decrypted.data;

      this.setState(
        {
          shouldShowMasterPassword: false,
          isFullWorkflow: false,
        },
        () => {
          sessionStorage.setItem('isSetPassword', '1');
        },
      );
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
    this.setState(
      {
        shouldShowMasterPassword: true,
      },
      () => sessionStorage.setItem('isSetPassword', '0'),
    );
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
            {...pageProps}
          />
        </SessionChecker>
      </Container>
    );
  }
}
