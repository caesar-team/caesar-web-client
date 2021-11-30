import React from 'react';
import styled from 'styled-components';
import { joinChildren } from '@caesar/common/utils/reactUtils';
import { Icon } from '@caesar/components';
import { media } from '@caesar/assets/styles/media';

const Wrapper = styled.div``;

const StepsRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  ${media.wideMobile`
    justify-content: center;
  `}    
`;

const StepBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ isDisabledNavigation }) => !isDisabledNavigation && 'cursor: pointer'};
`;

const SeparatorIconWrapper = styled.div`
  margin: 0 16px;
  line-height: 0;
`;

const StepDescription = styled.span`
  font-size: ${({ theme }) => theme.font.size.small};
  font-weight: 600;
  color: ${({ isActive, theme }) =>
    isActive ? theme.color.black : theme.color.lightGray};
`;

const getStepIndex = (steps, stepName) => {
  const stepNames = steps.map(({ name }) => name);

  return stepNames.indexOf(stepName);
};

const NavigationPanel = ({
  steps,
  currentStep,
  onClickStep,
  theme,
  isDisabledNavigation = false,
  ...props
}) => {
  const handleClick = step => () => {
    if (isDisabledNavigation) {
      return;
    }

    const currentStepIndex = getStepIndex(steps, currentStep);
    const stepIndex = getStepIndex(steps, step);

    if (stepIndex > currentStepIndex) return;

    if (onClickStep) {
      onClickStep(step);
    }
  };

  const renderStep = ({ name, text }, index) => {
    const isActive = name === currentStep;
    const number = index / 2 + 1;

    return (
      <StepBox
        key={index}
        isDisabledNavigation={isDisabledNavigation}
        onClick={handleClick(name)}
      >
        <StepDescription isActive={isActive}>
          {number}. {text}
        </StepDescription>
      </StepBox>
    );
  };

  const renderSeparator = ({ name }, index) => {
    const isActive = name === currentStep;

    return (
      <SeparatorIconWrapper key={index}>
        <Icon
          name="arrow-heavy"
          width={16}
          height={16}
          color={isActive ? 'black' : 'lightGray'}
        />
      </SeparatorIconWrapper>
    );
  };

  const renderedComponents = joinChildren(steps, renderStep, renderSeparator);

  return (
    <Wrapper {...props}>
      <StepsRow>{renderedComponents}</StepsRow>
    </Wrapper>
  );
};

export { NavigationPanel };
