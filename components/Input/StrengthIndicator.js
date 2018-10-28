import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Lines = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0 50px;
`;

const IndicatorLine = styled(({ isActive, ...props }) => <div {...props} />)`
  height: 5px;
  width: 100%;
  border-radius: 2.5px;
  background: ${({ isActive }) => (isActive ? '#3d70ff' : '#eaeaea')};
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }
`;

const Helpers = styled.div`
  display: flex;
  flex-direction: column;
`;

const HelperText = styled(({ isActive, ...props }) => <div {...props} />)`
  font-size: 18px;
  color: ${({ isActive }) => (isActive ? '#2e2f31' : '#c4c6cc')};

  &:before {
    content: '\\A';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ isActive }) => (isActive ? '#3d70ff' : '#eaeaea')};
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

const StrengthIndicator = ({ rules, value }) => {
  const matches = validate(rules, value);

  const renderedLines = [...matches]
    .sort((a, b) => Number(b.isValid) - Number(a.isValid))
    .map(({ isValid }, index) => (
      <IndicatorLine key={index} isActive={isValid} />
    ));

  const renderedHelpers = rules.map(({ text }, index) => {
    const { isValid } = matches[index];

    return (
      <HelperText key={index} isActive={isValid}>
        {text}
      </HelperText>
    );
  });

  return (
    <Wrapper>
      <Lines>{renderedLines}</Lines>
      <Helpers>{renderedHelpers}</Helpers>
    </Wrapper>
  );
};

export default StrengthIndicator;
