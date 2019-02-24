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

const TABS = [
  {
    name: 'onepassword',
    title: '1Password',
    description: '*.1pif files',
    icon: OnePasswordImg,
    icon2: OnePasswordImg2x,
  },
  {
    name: 'lastpassword',
    title: 'LastPass',
    description: 'Export script',
    icon: LastPassImg,
    icon2: LastPassImg2x,
  },
  {
    name: 'csv',
    title: 'CSV',
    description: '*.csv files',
    icon: FileCSVImg,
    icon2: FileCSVImg2x,
  },
];

class Import extends Component {
  renderTabs() {
    return TABS.map(({ name, title, description, icon, icon2 }) => {
      const component = (
        <TabWrapper>
          <Image src={icon} srcSet={`${icon} 1x, ${icon2} 2x`} />
          <TabText>
            <TabName>{title}</TabName>
            <TabDescription>{description}</TabDescription>
          </TabText>
        </TabWrapper>
      );
      return <Tab key={name} component={component} />;
    });
  }

  render() {
    const renderedTabs = this.renderTabs();

    return (
      <Wrapper>
        <Tabs>{renderedTabs}</Tabs>
      </Wrapper>
    );
  }
}

export default Import;
