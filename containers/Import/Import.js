import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { matchStrict } from 'common/utils/match';
import { parseFile } from 'common/utils/importUtils';
import { encryptItem } from 'common/utils/cipherUtils';
import { getKeys, postCreateItem, getList } from 'common/api';
import { ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE } from 'common/constants';
import { NavigationPanel } from 'components';
import { FileStep, FieldsStep, DataStep, ImportingStep } from './Steps';
import {
  STEPS,
  FILE_STEP,
  FIELDS_STEP,
  DATA_STEP,
  IMPORTING_STEP,
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

  async componentDidMount() {
    try {
      const { data: list } = await getList();
      const {
        data: { publicKey },
      } = await getKeys();

      this.inboxListId = list[0].id;
      this.publicKey = publicKey;
    } catch (error) {
      console.log(error);
    }
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

  handleFinishDataStep = async values => {
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
        this.importing(cleared);
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

  async importing(data) {
    const prepared = await Promise.all(
      data.map(async ({ type, ...secret }, index) => {
        const encryptedSecret = await encryptItem(
          pick(
            secret,
            type === ITEM_CREDENTIALS_TYPE
              ? CREDENTIALS_TYPE_FIELDS
              : DOCUMENT_TYPE_FIELDS,
          ),
          this.publicKey,
        );

        const item = {
          type,
          listId: this.inboxListId,
          secret: encryptedSecret,
        };

        this.setState({
          progress: Math.round((index / data.length) * 100) / 100,
        });

        return item;
      }),
    );

    try {
      // TODO: change this to batch post request
      await Promise.all(prepared.map(postCreateItem));

      this.setState({
        progress: 1,
      });
    } catch (error) {
      console.log(error);
    }
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
    const { currentStep } = this.state;

    return (
      <Wrapper>
        <Title>Settings / Import</Title>
        <Description>Select file type to import:</Description>
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
