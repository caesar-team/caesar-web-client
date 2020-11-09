import React, { memo } from 'react';
import {
  Wrapper,
  LineIndicators,
  LineIndicator,
  CircleIndicator,
  CircleIndicatorOverlay,
  ScoreName,
} from './styles';

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

export const INDICATOR_TYPE = {
  LINE: 'line',
  CIRCLE: 'circle',
};

const renderLineIndicators = score =>
  Object.keys(SCORE_NAME_MAP).map(key => {
    const isAcceptable = key <= score;

    return <LineIndicator key={key} isAcceptable={isAcceptable} />;
  });

const renderCircleIndicator = score => {
  const percent = (score + 1) * 20;

  return (
    <CircleIndicator className={`percent-${percent}`}>
      <CircleIndicatorOverlay />
    </CircleIndicator>
  );
};

const PasswordIndicatorComponent = ({
  score,
  type = INDICATOR_TYPE.CIRCLE,
  withFixWidth,
  ...props
}) => {
  const scoreName = SCORE_NAME_MAP[score];

  return (
    <Wrapper {...props}>
      {type === INDICATOR_TYPE.CIRCLE ? (
        renderCircleIndicator(score)
      ) : (
        <LineIndicators>{renderLineIndicators(score)}</LineIndicators>
      )}
      <ScoreName withFixWidth={withFixWidth}>{scoreName}</ScoreName>
    </Wrapper>
  );
};

const PasswordIndicator = memo(PasswordIndicatorComponent);

PasswordIndicator.ScoreName = ScoreName;

export { PasswordIndicator };
