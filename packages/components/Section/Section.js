import React from 'react';
import styled from 'styled-components';
import TextWithLines from '../TextWithLines/TextWithLines';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ArrowIcon = styled(Icon)`
  transform: ${({ isOpened }) => (isOpened ? 'scaleY(-1)' : 'scaleY(1)')};
  transition: transform 0.2s, color 0.2s;
`;

const SectionName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    ${ArrowIcon} {
      color: ${({ theme }) => theme.color.black};
    }
  }
`;

const IconImage = styled.img`
  object-fit: cover;
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const Section = ({
  name,
  icon,
  isOpened = false,
  onToggleSection = Function.prototype,
  children,
  className,
}) => {
  const onToggleEvent = name ? onToggleSection : Function.prototype;

  return (
    <Wrapper className={className}>
      {name && (
        <SectionName onClick={onToggleEvent}>
          <TextWithLines position="left" width={1}>
            {icon && <IconImage src={icon} />}
            {name}
          </TextWithLines>
          <ArrowIcon
            name="arrow-triangle"
            width={16}
            height={16}
            color="gray"
            isOpened={isOpened}
          />
        </SectionName>
      )}
      {isOpened && <ContentWrapper>{children}</ContentWrapper>}
    </Wrapper>
  );
};

Section.Name = TextWithLines;

export default Section;
