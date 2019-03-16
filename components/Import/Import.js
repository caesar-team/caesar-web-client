import React, { Component } from 'react';
import styled from 'styled-components';
import { matchStrict } from 'common/utils/match';
import { parseFile } from 'common/utils/importUtils';
import { ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE } from 'common/constants';
import { NavigationPanel } from '../NavigationPanel';
import { STEPS, FILE_STEP, FIELDS_STEP, DATA_STEP } from './constants';
import { FileStep, FieldsStep, DataStep, ImportingStep } from './Steps';

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

const Description = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 25px;
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

const normalizeData = (rows, { title, login, password, website, note }) =>
  rows.map((row, index) => ({
    index,
    title: row[title],
    login: row[login],
    password: row[password],
    website: row[website],
    note: row[note],
    type:
      row[password] && row[login] ? ITEM_CREDENTIALS_TYPE : ITEM_DOCUMENT_TYPE,
  }));

class Import extends Component {
  state = this.prepareInitialState();

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

  handleFinishDataStep = values => {
    const omittedFields = ['index'];
    const cleared = values.map(row =>
      row.filter(value => !!value && !omittedFields.includes(value)),
    );

    console.log(cleared);
  };

  prepareInitialState() {
    return {
      currentStep: FILE_STEP,
      data: {
        headings: [],
        rows: [],
      },
      matchings: {},
      selectedRows: [],
    };
  }

  renderStep() {
    const { currentStep, data, matchings } = this.state;

    return matchStrict(
      currentStep,
      {
        FILE_STEP: <FileStep onSubmit={this.handleOnload} />,
        FIELDS_STEP: (
          <FieldsStep
            headings={data.headings}
            onSubmit={this.handleSelectFields}
          />
        ),
        DATA_STEP: (
          <DataStep
            data={normalizeData(data.rows, matchings)}
            headings={matchings}
            onSubmit={this.handleFinishDataStep}
          />
        ),
        IMPORTING_STEP: <ImportingStep />,
      },
      null,
    );
  }

  renderNavigationPanel() {
    const { currentStep } = this.state;

    return <StyledNavigationPanel steps={STEPS} currentStep={currentStep} />;
  }

  render() {
    return (
      <Wrapper>
        <Title>Settings / Import</Title>
        <Description>Select file type to import:</Description>
        <StepWrapper>{this.renderStep()}</StepWrapper>
        {this.renderNavigationPanel()}
      </Wrapper>
    );
  }
}

export default Import;
