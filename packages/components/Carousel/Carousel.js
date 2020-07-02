import React, { Children, cloneElement, useState, useRef } from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  position: relative;
`;

const ArrowIcon = styled(Icon)`
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  ${({ disabled, theme }) => disabled && `color: ${theme.color.lightGray};`}
`;

const ArrowLeftIcon = styled(ArrowIcon)`
  transform: rotate(90deg);
`;

const ArrowRightIcon = styled(ArrowIcon)`
  transform: rotate(-90deg);
`;

const ArrowsWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.basic};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 48px;
`;

const OuterWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  min-width: 100%;
  position: relative;
  width: ${({ width }) => width}px;
  transform: translate(${({ shift }) => shift}px, 0);
  transition: 0.5s ease-in-out;
`;

const LEFT_DIRECTION = 'left';
const RIGHT_DIRECTION = 'right';

const getOffsetWidth = element => element?.current?.offsetWidth || 0;
const getScrollWidth = element => element?.current?.scrollWidth || 0;

const getOffsetOrEdge = (currentOffset, width) =>
  Math.min(Math.max(currentOffset, -width), 0);

const Carousel = ({ shiftPx = 250, children, className }) => {
  const [currentShiftPx, setCurrentShiftPx] = useState(0);
  const wrapperRef = useRef(null);
  const innerRef = useRef(null);
  const references = Array(Children.count(children))
    .fill(0)
    .map(() => useRef(null));

  const wrapperWidth = getOffsetWidth(wrapperRef);
  const referencesWidth = getScrollWidth(innerRef);
  const shiftWidth = referencesWidth - wrapperWidth;

  const isLeftArrowDisabled = currentShiftPx === 0;
  const isRightArrowDisabled = shiftWidth <= 0 || shiftWidth <= -currentShiftPx;

  const handleClickShift = direction => () => {
    const rate = direction === LEFT_DIRECTION ? 1 : -1;

    setCurrentShiftPx(
      getOffsetOrEdge(currentShiftPx + rate * shiftPx, shiftWidth),
    );
  };

  const renderChildren = () =>
    Children.map(children, (child, index) =>
      cloneElement(child, {
        ...child.props,
        ref: references[index],
      }),
    );

  return (
    <Wrapper className={className}>
      <ArrowsWrapper>
        <ArrowLeftIcon
          name="arrow-triangle"
          width={16}
          height={16}
          color="gray"
          disabled={isLeftArrowDisabled}
          onClick={handleClickShift(LEFT_DIRECTION)}
        />
        <ArrowRightIcon
          name="arrow-triangle"
          width={16}
          height={16}
          color="gray"
          disabled={isRightArrowDisabled}
          onClick={handleClickShift(RIGHT_DIRECTION)}
        />
      </ArrowsWrapper>
      <OuterWrapper ref={wrapperRef}>
        <InnerWrapper
          ref={innerRef}
          width={referencesWidth}
          shift={currentShiftPx}
        >
          {renderChildren()}
        </InnerWrapper>
      </OuterWrapper>
    </Wrapper>
  );
};

Carousel.ArrowsWrapper = ArrowsWrapper;

export { Carousel };
