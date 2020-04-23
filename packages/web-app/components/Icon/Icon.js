import React from 'react';
import styled from 'styled-components';
import { withOfflineDetection } from '../Offline';
import '@caesar/assets/icons/svg';

const Svg = styled.svg`
  display: inline-block;
  vertical-align: middle;
  fill: ${({ isInButton }) => (isInButton ? 'currentColor' : '')};

  & > * {
    ${({ disabled }) => disabled && `opacity: 0.5`}
  }
`;

const getIconDisabledStatus = (withOfflineCheck, isOnline, disabled) =>
  (withOfflineCheck && !isOnline) || disabled;

const Icon = ({
  name,
  isInButton,
  withOfflineCheck = false,
  isOnline,
  disabled,
  onClick = Function.prototype,
  onMouseEnter = Function.prototype,
  onMouseLeave = Function.prototype,
  ...props
}) => {
  if (!name) {
    return null;
  }

  const isDisabled = getIconDisabledStatus(
    withOfflineCheck,
    isOnline,
    disabled,
  );

  const events = isDisabled
    ? {}
    : {
        onClick,
        onMouseEnter,
        onMouseLeave,
      };

  return (
    <Svg isInButton={isInButton} disabled={isDisabled} {...props} {...events}>
      <use xlinkHref={`#icon-${name}--sprite`} />
    </Svg>
  );
};

export default withOfflineDetection(Icon);
