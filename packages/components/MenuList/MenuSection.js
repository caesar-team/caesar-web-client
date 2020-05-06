import React from 'react';
import styled from 'styled-components';
import Section from '../Section/Section';
import List from './List';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 48px;
`;

const MenuSection = ({
  name,
  activeListId,
  isOpened = false,
  icon,
  lists = [],
  children,
  className,
  onToggleSection = Function.prototype,
  onClickMenuItem = Function.prototype,
}) => {
  const renderedLists = lists.map(({ id, label, children: items }) => (
    <List
      key={id}
      name={label}
      itemsLength={items.length}
      isActive={activeListId === id}
      onClick={onClickMenuItem(id)}
    />
  ));

  const renderedContent = children || renderedLists;
  const onToggleEvent = name ? onToggleSection : Function.prototype;

  return (
    <Wrapper className={className}>
      <Section
        isOpened={isOpened}
        name={name}
        icon={icon}
        onToggleSection={onToggleEvent}
      >
        {renderedContent}
      </Section>
    </Wrapper>
  );
};

export default MenuSection;
