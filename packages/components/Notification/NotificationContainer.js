import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.notification};

  ${({ position }) =>
    position === 'top-center' &&
    `
      left: 50%;
      top: 16px;
      transform: translateX(-50%);
  `};

  ${({ position }) =>
    position === 'bottom-right' &&
    `
      right: 16px;
      bottom: 60px;
  `};
`;

class NotificationContainer extends PureComponent {
  timer = null;

  componentDidMount() {
    this.startTimer();
  }

  startTimer = () => {
    const { options: { timeout = 2500 } = {} } = this.props.notificationProps;

    if (timeout === 0) return;

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
    const { notificationProps, component: Component } = this.props;
    const { options: { position = 'top-center' } = {} } = notificationProps;

    return (
      <Wrapper position={position}>
        <Component {...notificationProps} />
      </Wrapper>
    );
  }
}

export default NotificationContainer;
