import React, { Component, Children, cloneElement } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div``;

const TabsWrapper = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const PanelWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 30px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.color.white};
`;

export class Tabs extends Component {
  handleTabClick = tabIndex => () => {
    const { name = '', children, onChange } = this.props;
    const tab = Children.toArray(children)[tabIndex];

    if (onChange) {
      onChange(name, tab.props.name);
    }
  };

  renderTabs() {
    const { activeTabName } = this.props;

    return Children.map(this.props.children, (child, index) =>
      cloneElement(child, {
        onClick: this.handleTabClick(index),
        tabIndex: index,
        isActive: child.props.name === activeTabName,
      }),
    );
  }

  renderActiveTabContent() {
    const { activeTabName } = this.props;

    const children = Children.toArray(this.props.children);
    const tab = children.find(child => child.props.name === activeTabName);

    if (tab) {
      return tab.props.children;
    }

    return null;
  }

  render() {
    const renderedTabs = this.renderTabs();
    const renderedContent = this.renderActiveTabContent();

    return (
      <Wrapper>
        <TabsWrapper>{renderedTabs}</TabsWrapper>
        <PanelWrapper>{renderedContent}</PanelWrapper>
      </Wrapper>
    );
  }
}

export default Tabs;
