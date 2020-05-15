import React from 'react';
import styled from 'styled-components';
import { joinChildren } from '@caesar/common/utils/reactUtils';
import { Icon } from '@caesar/components';

const Wrapper = styled.div``;

const StepsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  position: relative;
`;

const StepBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ isDisabledNavigation }) => !isDisabledNavigation && 'cursor: pointer'};
`;

const SeparatorIconWrapper = styled.div`
  margin: 0 20px;
  line-height: 10px;
`;

const StepDescription = styled.span`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: ${({ isActive, theme }) => (isActive ? theme.black : theme.gray)};
`;

const StyledIcon = styled(Icon)`
  fill: ${({ isActive, theme }) => (isActive ? theme.black : theme.gray)};
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
        <StyledIcon name="arrow" isActive={isActive} width={18} height={10} />
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

export default NavigationPanel;
