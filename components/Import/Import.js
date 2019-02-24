import React, { Component } from 'react';
import styled from 'styled-components';
import { Tabs, Tab } from 'components';
import OnePasswordImg from 'static/images/1password.png';
import OnePasswordImg2x from 'static/images/1password@2x.png';
import LastPassImg from 'static/images/lastpass.png';
import LastPassImg2x from 'static/images/lastpass@2x.png';
import FileCSVImg from 'static/images/csv.png';
import FileCSVImg2x from 'static/images/csv@2x.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.lightBlue};
  width: 100%;
`;

const Image = styled.img`
  padding-top: 45px;
  padding-left: 15px;
  object-fit: contain;
`;

const TABS = [
  { title: '1Password', description: '*.1pif files', icon: '' },
  { title: 'LastPass', description: 'Export script' },
  { title: 'CSV', description: '*.csv files' },
];

class Import extends Component {
  renderTabs() {

  }

  render() {
    return (
      <Wrapper>
        <Tabs>
          <Tab title="1Password">1Password</Tab>
          <Tab title="LastPass">LastPass</Tab>
          <Tab title="CSV">CSV</Tab>
        </Tabs>
      </Wrapper>
    );
  }
}

export default Import;
