import React, { Component } from 'react';
import styled from 'styled-components';
import * as openpgp from 'openpgp';
import { DEFAULT_IDLE_TIMEOUT } from '@caesar-utils/constants';
import OpenPGPWorker from '@caesar-utils/encryption.worker';
import { validateKeys } from '@caesar-utils/utils/key';
import { match } from '@caesar-utils/utils/match';
import { Dashboard, MasterPassword } from '@caesar/containers';
import { Login } from '@caesar/components';
import { SessionChecker } from '@caesar-ui';

const Wrapper = styled.div`
  width: 576px;
  height: 373px;
`;

const LOGIN_STEP = 'LOGIN_STEP';
const MASTER_PASSWORD_STEP = 'MASTER_PASSWORD_STEP';
const DASHBOARD_STEP = 'DASHBOARD_STEP';

class App extends Component {
  state = this.prepareInitialState();

  componentDidMount() {
    const { token } = this.props;

    if (token) {
      this.initOpenPGPWorker();

      this.props.fetchKeyPairRequest();
    }
  }

  handleSubmitMasterPassword = async (
    { password },
    { setSubmitting, setErrors },
  ) => {
    const {
      keyPair: { privateKey },
    } = this.props;

    try {
      await validateKeys(password, privateKey);

      this.props.setMasterPassword(password);

      this.setState({
        currentStep: DASHBOARD_STEP,
      });
    } catch (error) {
      setErrors({ password: 'Wrong password' });
      setSubmitting(false);
    }
  };

  handleInactiveTimeout = () => {
    this.setState({
      currentStep: MASTER_PASSWORD_STEP,
    });
  };

  initOpenPGPWorker() {
    openpgp.config.aead_protect = false;

    this.worker = new OpenPGPWorker();

    openpgp.initWorker({ workers: [this.worker] });
  }

  prepareInitialState() {
    return {
      currentStep: this.props.token ? MASTER_PASSWORD_STEP : LOGIN_STEP,
    };
  }

  render() {
    const { keyPair } = this.props;
    const { currentStep } = this.state;

    const renderedStep = match(
      currentStep,
      {
        [LOGIN_STEP]: <Login />,
        [MASTER_PASSWORD_STEP]: (
          <MasterPassword onSubmit={this.handleSubmitMasterPassword} />
        ),
        [DASHBOARD_STEP]: <Dashboard keyPair={keyPair} />,
      },
      null,
    );

    return (
      <Wrapper>
        <SessionChecker
          timeout={DEFAULT_IDLE_TIMEOUT}
          onFinishTimeout={this.handleInactiveTimeout}
        >
          {renderedStep}
        </SessionChecker>
      </Wrapper>
    );
  }
}

export default App;
