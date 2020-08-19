import React, { Component } from 'react';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { formatNumber } from '@caesar/common/utils/number';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  user-select: none;
`;

const RangeBase = styled.div`
  position: relative;
  height: 8px;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  background-color: ${({ theme }) => theme.color.white};

  &::before {
    content: '${({ minValue }) => minValue}';
    position: absolute;
    top: 15px;
    left: -4px;
    color: ${({ theme }) => theme.color.lightGray};
    font-size: 11px;
    font-weight: 600;
  }

  &::after {
    content: '${({ maxValue }) => maxValue}';
    position: absolute;
    top: 15px;
    right: -7px;
    color: ${({ theme }) => theme.color.lightGray};
    font-size: 11px;
    font-weight: 600;
  }
`;

const RangeValue = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
  white-space: nowrap;
`;

const RangeControl = styled.div.attrs(props => ({
  style: {
    left: `calc(${props.position}% - 8px)`,
  },
}))`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.upBasic};
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-color: ${({ theme }) => theme.color.black};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.black};
    & > ${RangeValue} {
      color: ${({ theme }) => theme.color.black};
    }
  }
`;

const Separator = styled.div`
  width: 6px;
  height: 10px;
  border-left: 1px solid ${({ theme }) => theme.color.white};
  border-right: 1px solid ${({ theme }) => theme.color.white};
`;

const RangeActiveLine = styled.div`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.basic};
  top: 0;
  height: 8px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.color.black};
  border: 1px solid ${({ theme }) => theme.color.black};
`;

class RangeInput extends Component {
  debouncedOnChange = debounce(this.props.onChange, 250);

  rangeBaseLineRef = React.createRef();

  fromControlRef = React.createRef();

  toControlRef = React.createRef();

  startPointerPosition = null;

  startClickPosition = null;

  componentDidUpdate(prevProps, prevState) {
    const { fromValue, toValue } = this.state;
    const { name } = this.props;

    const isStateChanged = this.state !== prevState;

    if (isStateChanged) {
      const eventObject = {
        target: {
          name,
          value: {
            fromValue,
            toValue,
          },
        },
      };

      this.debouncedOnChange(eventObject);
    }
  }

  getValue = ({ target }) => {
    const { min, max, defaultToValue, defaultFromValue } = this.props;
    const value = target === 'from' ? defaultFromValue : defaultToValue;

    if (value && value > max) return max;
    if (value && value < min) return min;

    return value || min;
  };

  getControlPosition = ({ target }) => {
    const { min, max } = this.props;
    const value = this.getValue({ target });

    if (!value) return 0;

    return ((value - min) / (max - min)) * 100;
  };

  calculatePosition = ({ percentDelta, target }) => {
    const { max, min } = this.props;

    let newPosition = this.startPointerPosition + percentDelta;

    if (target === 'from') {
      if (newPosition > this.state.toPosition) {
        newPosition = this.state.toPosition;
      }

      if (newPosition < 0) {
        newPosition = 0;
      }
    }

    if (target === 'to') {
      if (newPosition < this.state.fromPosition) {
        newPosition = this.state.fromPosition;
      }

      if (newPosition > 100) {
        newPosition = 100;
      }
    }

    const valuePerPercent = 100 / (max - min);
    const deltaValue = Math.round(newPosition / valuePerPercent);

    let newValue = min + deltaValue;

    if (newValue > max) {
      newValue = max;
    }

    const newStateObject =
      target === 'from'
        ? {
            fromPosition: newPosition,
            fromValue: newValue,
          }
        : {
            toPosition: newPosition,
            toValue: newValue,
          };

    this.setState(newStateObject);
  };

  mouseMoveCommonListener = ({ event, target }) => {
    event.stopPropagation();

    const { clientX } = event;

    const rangeLineRefWidth = this.rangeBaseLineRef.current
      ? this.rangeBaseLineRef.current.offsetWidth
      : 0;
    const pixelDelta = clientX - this.startClickPosition;
    const percentDelta = (pixelDelta / rangeLineRefWidth) * 100;

    this.calculatePosition({ percentDelta, target });
  };

  mouseFromMoveListener = event => {
    this.mouseMoveCommonListener({ event, target: 'from' });
  };

  mouseToMoveListener = event => {
    this.mouseMoveCommonListener({ event, target: 'to' });
  };

  mouseUpListener = () => {
    document.removeEventListener('mousemove', this.mouseToMoveListener);
    document.removeEventListener('mousemove', this.mouseFromMoveListener);
    document.removeEventListener('mouseup', this.mouseUpListener);
  };

  handleCommonMouseDown = ({ event, target }) => {
    const { clientX } = event;

    this.startClickPosition = clientX;

    this.startPointerPosition =
      target === 'from' ? this.state.fromPosition : this.state.toPosition;

    const mouseMoveListener =
      target === 'from' ? this.mouseFromMoveListener : this.mouseToMoveListener;

    document.addEventListener('mousemove', mouseMoveListener);
    document.addEventListener('mouseup', this.mouseUpListener);
  };

  handleFromMouseDown = event => {
    this.handleCommonMouseDown({ event, target: 'from' });
  };

  handleToMouseDown = event => {
    this.handleCommonMouseDown({ event, target: 'to' });
  };

  prepareInitialState = () => {
    return {
      fromValue: this.getValue({ target: 'from' }),
      fromPosition: this.getControlPosition({ target: 'from' }),
      toValue: this.getValue({ target: 'to' }),
      toPosition: this.getControlPosition({ target: 'to' }),
    };
  };

  // eslint-disable-next-line
  state = this.prepareInitialState();

  render() {
    const { min, max, isMulti = false, className } = this.props;
    const { fromValue, toValue, fromPosition, toPosition } = this.state;

    return (
      <Wrapper className={className}>
        <RangeBase ref={this.rangeBaseLineRef} minValue={min} maxValue={max} />
        <RangeActiveLine
          style={{
            left: `${fromPosition}%`,
            width: `calc(${toPosition}% - ${fromPosition}%)`,
          }}
        />
        {isMulti && (
          <RangeControl
            onMouseDown={this.handleFromMouseDown}
            ref={this.fromControlRef}
            position={fromPosition}
          >
            <RangeValue>{formatNumber({ value: fromValue })}</RangeValue>
          </RangeControl>
        )}
        <RangeControl
          onMouseDown={this.handleToMouseDown}
          ref={this.toControlRef}
          position={toPosition}
        >
          <Separator />
          <RangeValue style={{ top: 20 }}>
            {formatNumber({ value: toValue })}
          </RangeValue>
        </RangeControl>
      </Wrapper>
    );
  }
}

export default RangeInput;
