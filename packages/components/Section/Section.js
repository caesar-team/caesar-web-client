import React from 'react';
import styled from 'styled-components';
import TextWithLines from '../TextWithLines/TextWithLines';
import Icon from '../Icon/Icon';

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

const IconImage = styled.img`
  object-fit: cover;
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const ArrowIcon = styled(Icon)`
  width: 16px;
  height: 8px;
  margin-left: 20px;
  fill: ${({ theme }) => theme.lightGray};
  transform: ${({ isOpened }) => (isOpened ? 'scaleY(-1)' : 'scaleY(1)')};
  transition: all 0.2s;
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
  isOpened = false,
  icon,
  children,
  className,
  onToggleSection = Function.prototype,
}) => {
  const onToggleEvent = name ? onToggleSection : Function.prototype;

  return (
    <Wrapper className={className}>
      {name && (
        <SectionName onClick={onToggleEvent}>
          <TextWithLinesStyled position="left" width={1}>
            {icon && <IconImage src={icon} />}
            {name}
          </TextWithLinesStyled>
          <ArrowIcon
            name="arrow-triangle"
            isOpened={isOpened}
            color="lightGray"
          />
        </SectionName>
      )}
      {isOpened && <ContentWrapper>{children}</ContentWrapper>}
    </Wrapper>
  );
};

Section.Name = TextWithLinesStyled;

export default Section;
