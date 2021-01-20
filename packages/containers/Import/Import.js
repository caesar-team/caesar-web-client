import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { matchStrict } from '@caesar/common/utils/match';
import { parseFile } from '@caesar/common/utils/importUtils';
import { ITEM_TYPE, ROUTES, IMPORT_PROGRESS_THRESHOLD } from '@caesar/common/constants';
import { Button, NavigationPanel, SettingsWrapper } from '@caesar/components';
import { DataStep, FieldsStep, FileStep, ImportingStep } from './Steps';
import {
  DATA_STEP,
  FIELDS_STEP,
  FILE_STEP,
  IMPORTING_STEP,
  STEPS,
} from './constants';

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.white};
  padding: 12px 24px;
`;

const StyledNavigationPanel = styled(NavigationPanel)`
  margin-top: 25px;
`;

const ButtonWrapper = styled.div`
  margin-top: 24px;
`;

const normalizeData = (rows, { name, login, password, website, note }) =>
  rows.map((row, index) => ({
    index,
    name: row[name],
    login: row[login],
    password: row[password],
    website: row[website],
    note: row[note],
    type:
      row[password] && row[login] ? ITEM_TYPE.CREDENTIALS : ITEM_TYPE.DOCUMENT,
  }));

const pick = (object, keys) =>
  keys.reduce((accumulator, key) => {
    if (object[key]) {
      return { ...accumulator, [key]: object[key] };
    }

    return accumulator;
  }, {});

const DOCUMENT_TYPE_FIELDS = ['name', 'note'];
const CREDENTIALS_TYPE_FIELDS = [
  'name',
  'login',
  'password',
  'website',
  'note',
];

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

  handleFinishDataStep = (teamId, listId, values, setSubmitting) => {
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
        this.importing(teamId, listId, cleared, setSubmitting);
      },
    );
  };

  handleClickStep = step => {
    this.setState({
      currentStep: step,
    });
  };

  handleClickToDashboard = () => {
    this.props.router.push(ROUTES.DASHBOARD);
  };

  handleCancelFlow = () => {
    this.setState(this.prepareInitialState());
  };
  
  importing(teamId, listId, data, setSubmitting) {
    const items = data.map(({ type, ...secret }) => {
      const fields = pick(
        secret,
        type === ITEM_TYPE.CREDENTIALS
          ? CREDENTIALS_TYPE_FIELDS
          : DOCUMENT_TYPE_FIELDS,
      );

      return {
        ...fields,
        teamId,
        type,
        attachments: [],
      };
    });

    this.props.createItemsBatchRequest(items, listId, setSubmitting);
  }

  prepareInitialState() {
    return {
      currentStep: FILE_STEP,
      data: {
        headings: [],
        rows: [],
      },
      matchings: {},
    };
  }

  renderStep() {
    const {
      teamsLists,
      currentUserTeamId,
      currentListId,
      currentTeamDefaultList,
      importProgress,
      currentUserTeamsList,
      fetchTeamListsRequest,
    } = this.props;
    const { currentStep, data, matchings } = this.state;

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
            currentUserTeamId={currentUserTeamId}
            currentListId={currentListId}
            currentTeamDefaultList={currentTeamDefaultList}
            currentUserTeamsList={currentUserTeamsList}
            data={normalizeData(data.rows, matchings)}
            headings={matchings}
            fetchTeamListsRequest={fetchTeamListsRequest}
            onSubmit={this.handleFinishDataStep}
            onCancel={this.handleCancelFlow}
          />
        ),
        IMPORTING_STEP: (
          <ImportingStep
            progress={importProgress}
            onClickToDashboard={this.handleClickToDashboard}
          />
        ),
      },
      null,
    );
  }

  render() {
    const { isLoading, importProgress } = this.props;
    const { currentStep } = this.state;

    return (
      <SettingsWrapper isLoading={isLoading} isCompact title="Import">
        <StepWrapper>{this.renderStep()}</StepWrapper>
        <StyledNavigationPanel
          steps={STEPS}
          currentStep={currentStep}
          onClickStep={this.handleClickStep}
        />
        {currentStep === IMPORTING_STEP && (
          <ButtonWrapper>
            <Button
              color="white"
              disabled={importProgress < IMPORT_PROGRESS_THRESHOLD}
              onClick={this.handleCancelFlow}
            >
              Import one more *.csv
            </Button>
          </ButtonWrapper>
        )}
      </SettingsWrapper>
    );
  }
}

export default withRouter(Import);
