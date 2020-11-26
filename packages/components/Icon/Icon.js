import React, { memo } from 'react';
import styled from 'styled-components';
import { useNavigatorOnline } from '@caesar/common/hooks';
import '@caesar/assets/icons/svg';

const Svg = styled.svg`
  display: inline-block;
  vertical-align: middle;
  color: ${({ color, theme }) => theme.color[color]};
  fill: currentColor;
  transition: color 0.2s;

  ${({ width }) => width && `flex: 0 0 ${width}px;`}
  ${({ disabled }) => disabled && `opacity: 0.5;`}
`;

const getIconDisabledStatus = (withOfflineCheck, isOnline, disabled) =>
  (withOfflineCheck && !isOnline) || disabled;

const IconComponent = ({
  name,
  color,
  withOfflineCheck = false,
  disabled,
  onClick = Function.prototype,
  onMouseEnter = Function.prototype,
  onMouseLeave = Function.prototype,
  ...props
}) => {
  if (!name) {
    return null;
  }

  const isOnline = useNavigatorOnline();
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
    <Svg color={color} disabled={isDisabled} {...props} {...events}>
      <use xlinkHref={`#icon-${name}--sprite`} />
    </Svg>
  );
};

export const Icon = memo(IconComponent);
