import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { matchStrict } from 'common/utils/match';
import { parseFile } from 'common/utils/importUtils';
import { ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE } from 'common/constants';
import { NavigationPanel, TextLoader } from 'components';
import { DataStep, FieldsStep, FileStep, ImportingStep } from './Steps';
import {
  DATA_STEP,
  FIELDS_STEP,
  FILE_STEP,
  IMPORTING_STEP,
  STEPS,
} from './constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.lightBlue};
  width: 100%;
  padding: 60px;
`;

const Title = styled.div`
  font-size: 36px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 30px;
`;

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.white};
  padding: 30px;
`;

const StyledNavigationPanel = styled(NavigationPanel)`
  margin-top: 25px;
`;

const normalizeData = (rows, { name, login, pass, website, note }) =>
  rows.map((row, index) => ({
    index,
    name: row[name],
    login: row[login],
    pass: row[pass],
    website: row[website],
    note: row[note],
    type: row[pass] && row[login] ? ITEM_CREDENTIALS_TYPE : ITEM_DOCUMENT_TYPE,
  }));

const pick = (object, keys) =>
  keys.reduce((accumulator, key) => {
    if (object[key]) {
      return { ...accumulator, [key]: object[key] };
    }

    return accumulator;
  }, {});

const DOCUMENT_TYPE_FIELDS = ['name', 'note'];
const CREDENTIALS_TYPE_FIELDS = ['name', 'login', 'pass', 'website', 'note'];

class Import extends Component {
  state = this.prepareInitialState();

  componentDidMount() {
    this.props.initWorkflow(false);
  }

  handleOnload = ({ file }) => {
    const data = parseFile(file.raw);

    this.setState({
      data,
      currentStep: FIELDS_STEP,
    });
  };

  handleSelectFields = fields => {
    this.setState({
      matchings: fields,
      currentStep: DATA_STEP,
    });
  };

  handleFinishDataStep = (listId, values, setSubmitting) => {
    const omittedFields = ['index'];
    const cleared = values.map(row => {
      const keys = Object.keys(row);

      return keys
        .filter(key => !!row[key] && !omittedFields.includes(key))
        .reduce(
          (accumulator, key) => ({ ...accumulator, [key]: row[key] }),
          {},
        );
    });

    this.setState(
      {
        currentStep: IMPORTING_STEP,
      },
      () => {
        this.importing(listId, cleared, setSubmitting);
      },
    );
  };

  handleClickStep = step => {
    this.setState({
      currentStep: step,
    });
  };

  handleClickToDashboard = () => {
    this.props.router.push('/');
  };

  handleCancelFlow = () => {
    this.setState(this.prepareInitialState());
  };

  // TODO: do progress bar in saga
  importing(listId, data, setSubmitting) {
    const items = data.map(({ type, ...secret }) => {
      const fields = pick(
        secret,
        type === ITEM_CREDENTIALS_TYPE
          ? CREDENTIALS_TYPE_FIELDS
          : DOCUMENT_TYPE_FIELDS,
      );

      return {
        ...fields,
        type,
        attachments: [],
      };
    });

    this.props.createItemsBatchRequest(items, listId, setSubmitting);

    this.setState({
      progress: 1,
    });
  }

  prepareInitialState() {
    return {
      currentStep: FILE_STEP,
      data: {
        headings: [],
        rows: [],
      },
      matchings: {},
      progress: 0,
    };
  }

  renderStep() {
    const { teamsLists } = this.props;
    const { currentStep, data, matchings, progress } = this.state;

    return matchStrict(
      currentStep,
      {
        FILE_STEP: <FileStep onSubmit={this.handleOnload} />,
        FIELDS_STEP: (
          <FieldsStep
            initialValues={matchings}
            headings={data.headings}
            onSubmit={this.handleSelectFields}
            onCancel={this.handleCancelFlow}
          />
        ),
        DATA_STEP: (
          <DataStep
            teamsLists={teamsLists}
            data={normalizeData(data.rows, matchings)}
            headings={matchings}
            onSubmit={this.handleFinishDataStep}
            onCancel={this.handleCancelFlow}
          />
        ),
        IMPORTING_STEP: (
          <ImportingStep
            progress={progress}
            onClickToDashboard={this.handleClickToDashboard}
          />
        ),
      },
      null,
    );
  }

  render() {
    const { isLoading } = this.props;
    const { currentStep } = this.state;

    if (isLoading) {
      return (
        <Wrapper>
          <TextLoader />
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <Title>Import</Title>
        <StepWrapper>{this.renderStep()}</StepWrapper>
        <StyledNavigationPanel
          steps={STEPS}
          currentStep={currentStep}
          onClickStep={this.handleClickStep}
        />
      </Wrapper>
    );
  }
}

export default withRouter(Import);
