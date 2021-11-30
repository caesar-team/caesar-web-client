import React, { forwardRef } from 'react';
import zxcvbn from 'zxcvbn';
import styled from 'styled-components';
import { GOOD_PASSWORD_SCORE } from '@caesar/common/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Helpers = styled.div`
  display: flex;
  flex-direction: ${({ isMobile }) => isMobile ? 'row' : 'column'};
  ${({ isMobile }) => isMobile && 'justify-content: space-between'};
  flex-wrap: wrap;
`;

const HelperText = styled(({ isActive, ...props }) => <div {...props} />)`
  font-size: 18px;
  color: ${({ theme, isActive }) =>
    isActive ? theme.color.emperor : theme.color.gallery};
  margin-bottom: 16px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &::before {
    content: '\\A';
    width: ${({ isMobile }) => isMobile ? '8px' : '10px'};
    height: ${({ isMobile }) => isMobile ? '8px' : '10px'};
    border-radius: 50%;
    background: ${({ theme, isActive }) =>
      isActive ? theme.color.black : theme.color.gallery};
    display: inline-block;
    margin-right: ${({ isMobile }) => isMobile ? '8px' : '10px'};
  }
`;

const Text = styled.div``;

const validate = (rules, value) =>
  rules.map(({ text, regexp }) => ({
    text,
    regexp,
    isValid:
      regexp === 'zxcvbn'
        ? zxcvbn(value).score >= GOOD_PASSWORD_SCORE
        : regexp.test(value),
  }));

const StrengthIndicator = forwardRef(
  ({ text = '', rules, value, isMobile = false, ...props }, ref) => {
    const matches = validate(rules, value);

    const renderedHelpers = rules.map(({ text: ruleText }, index) => {
      const { isValid } = matches[index];

      return (
        <HelperText key={index} isActive={isValid}>
          {ruleText}
        </HelperText>
      );
    });

    return (
      <Wrapper {...props} ref={ref}>
        {text && <Text>{text}</Text>}
        <Helpers isMobile={isMobile}>{renderedHelpers}</Helpers>
      </Wrapper>
    );
  },
);

StrengthIndicator.Text = Text;
StrengthIndicator.HelperText = HelperText;

export default StrengthIndicator;
