import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  max-width: 400px;
  width: 100%;

  ${({ position }) =>
    position === 'top-center' &&
    `
    left: 50%;
    top: 0;
    padding-top: 16px;
    transform: translateX(-50%);
  `};
`;

class NotificationContainer extends PureComponent {
  timer = null;

  componentDidMount() {
    this.startTimer();
  }

  startTimer = () => {
    const { timeout } = this.props;

    this.timer = setTimeout(this.hide, timeout);
  };

  stopTimer = () => {
    if (!this.timer) return;

    clearTimeout(this.timer);
  };

  hide = () => {
    this.stopTimer();

    this.props.onHide();

    this.props.onRemove();
  };

  render() {
    const {
      notificationProps,
      component: Component,
      position = 'top-center',
    } = this.props;

    return (
      <Wrapper position={position}>
        <Component {...notificationProps} />
      </Wrapper>
    );
  }
}

export default NotificationContainer;
