import React from 'react';
import styled from 'styled-components';
import TextWithLines from '../TextWithLines/TextWithLines';
import Icon from '../Icon/Icon';
import List from './List';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 48px;
`;

const SectionName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  &:hover {
    cursor: pointer;
  }
`;

const ArrowIcon = styled(Icon)`
  width: 16px;
  height: 8px;
  margin-left: 20px;
  fill: ${({ theme }) => theme.lightGray};
`;

const IconStyled = styled(Icon)`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const TextWithLinesStyled = styled(TextWithLines)`
  font-size: 12px;
  font-weight: initial;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = ({
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
  const iconName = isOpened ? 'arrow-up-small' : 'arrow-down-small';

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
      {name && (
        <SectionName onClick={onToggleEvent}>
          <TextWithLinesStyled position="left" width={1}>
            {icon && <IconStyled name={icon} />}
            {name}
          </TextWithLinesStyled>
          <ArrowIcon name={iconName} />
        </SectionName>
      )}
      {isOpened && <ContentWrapper>{renderedContent}</ContentWrapper>}
    </Wrapper>
  );
};

export default Section;
