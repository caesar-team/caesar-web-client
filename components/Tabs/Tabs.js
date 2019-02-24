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
  min-height: 100px;
  border: 1px solid #e6e1e2;
  padding: 42px 20px;
`;

export class Tabs extends Component {
  state = {
    activeTabIndex: 0,
  };

  handleTabClick = tabIndex => () => {
    const { name = '', children, onChange } = this.props;

    this.setState(
      {
        activeTabIndex: tabIndex,
      },
      () => {
        if (onChange) {
          const child = Children.toArray(children)[tabIndex];
          onChange(name, child.props.value);
        }
      },
    );
  };

  renderTabs() {
    return Children.map(this.props.children, (child, index) =>
      cloneElement(child, {
        onClick: this.handleTabClick(index),
        tabIndex: index,
        isActive: index === this.state.activeTabIndex,
      }),
    );
  }

  renderActiveTabContent() {
    const { activeTabIndex } = this.state;

    const children = Children.toArray(this.props.children);

    if (children[activeTabIndex]) {
      return children[activeTabIndex].props.children;
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
