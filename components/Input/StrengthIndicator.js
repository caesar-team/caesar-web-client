import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Helpers = styled.div`
  display: flex;
  flex-direction: column;
`;

const HelperText = styled(({ isActive, ...props }) => <div {...props} />)`
  font-size: 18px;
  color: ${({ theme, isActive }) => (isActive ? theme.emperor : theme.gallery)};
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  &:before {
    content: '\\A';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ theme, isActive }) =>
      isActive ? theme.black : theme.gallery};
    display: inline-block;
    margin-right: 20px;
  }
`;

const validate = (rules, value) =>
  rules.map(({ text, regexp }) => ({
    text,
    regexp,
    isValid: regexp.test(value),
  }));

const StrengthIndicator = ({ rules, value, ...props }) => {
  const matches = validate(rules, value);

  const renderedHelpers = rules.map(({ text }, index) => {
    const { isValid } = matches[index];

    return (
      <HelperText key={index} isActive={isValid}>
        {text}
      </HelperText>
    );
  });

  return (
    <Wrapper {...props}>
      <Helpers>{renderedHelpers}</Helpers>
    </Wrapper>
  );
};

export default StrengthIndicator;
