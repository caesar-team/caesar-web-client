import React, { Component, Children, cloneElement, createRef } from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  position: relative;
`;

const ArrowIcon = styled(Icon)`
  width: 6px;
  height: 10px;
  cursor: pointer;
`;

const ArrowsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 48px;
  position: absolute;
  top: 0;
  right: 0;
`;

const OuterWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-top: 30px;
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

const calculateWidth = elements =>
  elements.reduce(
    (accumulator, element) =>
      element.current ? accumulator + element.current.offsetWidth : accumulator,
    0,
  );

const getOffsetOrEdge = (currentOffset, width) =>
  Math.min(Math.max(currentOffset, -width), 0);

class Carousel extends Component {
  state = this.prepareInitialState();

  references = Array(Children.count(this.props.children))
    .fill(0)
    .map(() => createRef());

  handleClickShift = direction => () => {
    const { shiftPx = 250 } = this.props;
    const rate = direction === LEFT_DIRECTION ? 1 : -1;

    const width = calculateWidth(this.references);

    this.setState(prevState => ({
      currentShiftPx: getOffsetOrEdge(
        prevState.currentShiftPx + rate * shiftPx,
        width,
      ),
    }));
  };

  prepareInitialState() {
    return {
      currentShiftPx: 0,
    };
  }

  renderChildren() {
    const { children } = this.props;

    return Children.map(children, (child, index) =>
      cloneElement(child, {
        ...child.props,
        ref: this.references[index],
      }),
    );
  }

  render() {
    const { currentShiftPx } = this.state;

    const width = calculateWidth(this.references);

    return (
      <Wrapper>
        <ArrowsWrapper>
          <ArrowIcon
            name="arrow-left-big"
            onClick={this.handleClickShift(LEFT_DIRECTION)}
          />
          <ArrowIcon
            name="arrow-right-big"
            onClick={this.handleClickShift(RIGHT_DIRECTION)}
          />
        </ArrowsWrapper>
        <OuterWrapper>
          <InnerWrapper width={width} shift={currentShiftPx}>
            {this.renderChildren()}
          </InnerWrapper>
        </OuterWrapper>
      </Wrapper>
    );
  }
}

export default Carousel;
