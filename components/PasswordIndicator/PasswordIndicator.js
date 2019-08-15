import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Indicators = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Indicator = styled.div`
  display: flex;
  width: 100%;
  margin-right: 10px;
  border: 1px solid
    ${({ isAcceptable, theme }) =>
      isAcceptable ? theme.black : theme.lightGray};

  &:last-child {
    margin-right: 0;
  }
`;

const ScoreName = styled.div`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: ${({ theme }) => theme.black};
  margin-left: 16px;
  width: 80px;
  text-align: right;
`;

/*
From zxcvbn docs: https://github.com/dropbox/zxcvbn
0 # too guessable: risky password. (guesses < 10^3)
1 # very guessable: protection from throttled online attacks. (guesses < 10^6)
2 # somewhat guessable: protection from unthrottled online attacks. (guesses < 10^8)
3 # safely unguessable: moderate protection from offline slow-hash scenario. (guesses < 10^10)
4 # very unguessable: strong protection from offline slow-hash scenario. (guesses >= 10^10)
*/

const SCORE_NAME_MAP = {
  0: 'Risky',
  1: 'Weak',
  2: 'Medium',
  3: 'Good',
  4: 'Excellent',
};

const PasswordIndicator = ({ score, ...props }) => {
  const scoreName = SCORE_NAME_MAP[score];

  const renderedIndicators = Object.keys(SCORE_NAME_MAP).map(key => {
    const isAcceptable = key <= score;

    return <Indicator key={key} isAcceptable={isAcceptable} />;
  });

  return (
    <Wrapper {...props}>
      <Indicators>{renderedIndicators}</Indicators>
      <ScoreName>{scoreName}</ScoreName>
    </Wrapper>
  );
};

export default PasswordIndicator;
