import React, { memo } from 'react';
import styled, { css } from 'styled-components';

export const POSITION = {
  TOP_LEFT: 'top_left',
  TOP_CENTER: 'top_center',
  TOP_RIGHT: 'top_right',
  CENTER_LEFT: 'center_left',
  CENTER_RIGHT: 'center_right',
  BOTTOM_LEFT: 'bottom_left',
  BOTTOM_CENTER: 'bottom_center',
  BOTTOM_RIGHT: 'bottom_right',
};

const getHintPosition = ({ position }) => {
  switch (position) {
    case POSITION.BOTTOM_LEFT:
      return `
        bottom: 0;
        right: 0;
        transform: translate(0, 100%);
      `;
    case POSITION.BOTTOM_RIGHT:
      return `
        bottom: 0;
        left: 0;
        transform: translate(0, 100%);
      `;
    case POSITION.BOTTOM_CENTER:
      return `
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 100%);
      `;
    case POSITION.CENTER_LEFT:
      return `
        top: 50%;
        right: calc(100% + 4px);
        transform: translate(0, -50%);
      `;
    case POSITION.CENTER_RIGHT:
      return `
        top: 50%;
        left: calc(100% + 4px);
        transform: translate(0, -50%);
      `;
    case POSITION.TOP_LEFT:
      return `
        top: -8px;
        right: 0;
        transform: translate(0, -100%);
      `;
    case POSITION.TOP_RIGHT:
      return `
        top: -8px;
        left: 0;
        transform: translate(0, -100%);
      `;
    case POSITION.TOP_CENTER:
    default:
      return `
        top: -8px;
        left: 50%;
        transform: translate(-50%, -100%);
      `;
  }
};

export const HintStyles = css`
  z-index: ${({ theme }) => theme.zIndex.hidden};
  padding: 4px 8px;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 600;
  text-transform: none;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
  border-radius: 4px;
  opacity: 0;
  transition: z-index 0.2s, opacity 0.2s;
`;

const Inner = styled.div`
  ${HintStyles};
  position: absolute;
  ${getHintPosition}
  ${({ hintMaxWidth }) =>
    hintMaxWidth &&
    `
      width: max-content;
      max-width: ${hintMaxWidth}px;
      white-space: normal;
    `}
`;

const Wrapper = styled.div`
  position: relative;

  &:hover ${Inner} {
    z-index: ${({ theme }) => theme.zIndex.basic};
    opacity: 1;
  }
`;

const HintComponent = ({
  text,
  position = POSITION.TOP_CENTER,
  hintMaxWidth,
  children,
  className,
}) => (
  <Wrapper className={className}>
    {children}
    {text && (
      <Inner position={position} hintMaxWidth={hintMaxWidth}>
        {text}
      </Inner>
    )}
  </Wrapper>
);

const Hint = memo(HintComponent);

Hint.Hint = Inner;

export { Hint, POSITION as HINT_POSITION };
