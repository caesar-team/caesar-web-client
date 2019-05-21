import React, { Component } from 'react';
import styled from 'styled-components';
import * as openpgp from 'openpgp';
import OpenPGPWorker from '@caesar-utils/openpgp.worker';
import { validateKeys } from '@caesar-utils/utils/key';
import { match } from '@caesar-utils/utils/match';
import { Dashboard, MasterPassword } from 'containers';

const Wrapper = styled.div`
  width: 576px;
  height: 373px;
`;

const MASTER_PASSWORD_STEP = 'MASTER_PASSWORD_STEP';
const DASHBOARD_STEP = 'DASHBOARD_STEP';

class App extends Component {
  state = this.prepareInitialState();

  componentDidMount() {
    this.initOpenPGPWorker();

    this.props.fetchKeyPairRequest();
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

  initOpenPGPWorker() {
    openpgp.config.aead_protect = false;

    this.worker = new OpenPGPWorker();

    openpgp.initWorker({ workers: [this.worker] });
  }

  prepareInitialState() {
    return {
      currentStep: MASTER_PASSWORD_STEP,
    };
  }

  render() {
    const { keyPair } = this.props;
    const { currentStep } = this.state;

    const renderedStep = match(
      currentStep,
      {
        [MASTER_PASSWORD_STEP]: (
          <MasterPassword onSubmit={this.handleSubmitMasterPassword} />
        ),
        [DASHBOARD_STEP]: <Dashboard keyPair={keyPair} />,
      },
      null,
    );

    return <Wrapper>{renderedStep}</Wrapper>;
  }
}

export default App;
