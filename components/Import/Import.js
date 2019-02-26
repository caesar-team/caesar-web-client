import React, { Component } from 'react';
import styled from 'styled-components';
import { matchStrict } from 'common/utils/match';
import { Tabs, Tab } from 'components';
import { parseFile } from 'common/utils/importUtils';
import { NavigationPanel } from '../NavigationPanel';
import {
  TABS,
  STEPS,
  FILE_TYPE_MAP,
  FILE_STEP,
  FIELDS_STEP,
  DATA_STEP,
  IMPORTING_STEP,
  ONEPASSWORD_TYPE,
  LASTPASS_TYPE,
  CSV_TYPE,
} from './constants';
import { FileStep, FieldsStep, DataStep, ImportingStep } from './Steps';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.lightBlue};
  width: 100%;
  padding: 60px;
`;

const Image = styled.img`
  object-fit: contain;
  margin-right: 20px;
  width: 50px;
  height: 50px;
`;

const TabWrapper = styled.div`
  display: flex;
  padding: 30px;
  align-items: center;
  border: 1px solid #eaeaea;
  border-bottom: 0;
`;

const TabText = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabName = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
`;

const TabDescription = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const Title = styled.div`
  font-size: 36px;
  letter-spacing: 1px;
  color: #000000;
  margin-bottom: 30px;
`;

const Description = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: #000000;
  margin-bottom: 25px;
`;

const StyledNavigationPanel = styled(NavigationPanel)`
  margin-top: 25px;
`;

class Import extends Component {
  state = this.prepareInitialState();

  handleChangeTab = (name, tabName) => {
    this.setState({
      currentTab: tabName,
    });
  };

  handleOnload = ({ files }, FormikBag) => {};

  prepareInitialState() {
    return {
      currentStep: FILE_STEP,
      currentTab: ONEPASSWORD_TYPE,
      data: [],
    };
  }

  renderTabContent() {
    const { currentStep, currentTab } = this.state;

    return matchStrict(
      currentStep,
      {
        FILE_STEP: (
          <FileStep
            type={FILE_TYPE_MAP[currentTab].type}
            onSubmit={this.handleOnload}
          />
        ),
        DATA_STEP: <DataStep />,
        IMPORTING_STEP: <ImportingStep />,
      },
      null,
    );
  }

  renderTabs() {
    const { currentTab } = this.state;

    const renderedTabs = TABS.map(
      ({ name, title, description, icon, icon2 }) => {
        const component = (
          <TabWrapper>
            <Image src={icon} srcSet={`${icon} 1x, ${icon2} 2x`} />
            <TabText>
              <TabName>{title}</TabName>
              <TabDescription>{description}</TabDescription>
            </TabText>
          </TabWrapper>
        );

        return (
          <Tab key={name} name={name} component={component}>
            {this.renderTabContent()}
          </Tab>
        );
      },
    );

    return (
      <Tabs
        name="import"
        activeTabName={currentTab}
        onChange={this.handleChangeTab}
      >
        {renderedTabs}
      </Tabs>
    );
  }

  renderNavigationPanel() {
    const { currentStep, currentTab } = this.state;

    const steps =
      currentTab === CSV_TYPE
        ? STEPS
        : STEPS.filter(({ name }) => name !== FIELDS_STEP);

    return <StyledNavigationPanel steps={steps} currentStep={currentStep} />;
  }

  render() {
    return (
      <Wrapper>
        <Title>Settings / Import</Title>
        <Description>Select file type to import:</Description>
        {this.renderTabs()}
        {this.renderNavigationPanel()}
      </Wrapper>
    );
  }
}

export default Import;
