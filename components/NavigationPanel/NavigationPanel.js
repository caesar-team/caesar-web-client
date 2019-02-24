import React from 'react';
import styled from 'styled-components';
import { joinChildren } from 'common/utils/reactUtils';
import { Icon } from 'components';

const Wrapper = styled.div`
  border-bottom: 2px dotted
    ${({ theme }) => theme.stark};
  padding-bottom: 32px;
`;

const StepsRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 11;
`;

const StepBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ isDisabledNavigation }) =>
  !isDisabledNavigation && 'cursor: pointer'};
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SeparatorIconWrapper = styled.div`
  margin-top: 20px;
`;

const StepDescription = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.6px;
  color: ${({ isActive, theme }) =>
  isActive ? theme.baratheon : theme.greyjoy};
  margin-top: 16px;
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

  const renderStep = (
    { name, text, icon: IconComponent, activeIcon: ActiveIconComponent },
    index,
  ) => {
    const isActive = name === currentStep;
    const number = index / 2 + 1;

    return (
      <StepBox
        key={index}
        isDisabledNavigation={isDisabledNavigation}
        onClick={handleClick(name)}
      >
        <IconWrapper>
          <StyledIcon as={isActive ? ActiveIconComponent : IconComponent} />
        </IconWrapper>
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
        <Icon name="arrow-right" />
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
