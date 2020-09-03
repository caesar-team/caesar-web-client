import React, { useState, memo } from 'react';
import { useEffectOnce } from 'react-use';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.notification};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: ${({ theme }) => theme.color.black};
  border-radius: 3px;
  box-shadow: 0 11px 23px 0 ${({ theme }) => theme.color.blackBoxShadow};

  ${({ position }) =>
    position === 'top-center' &&
    `
      left: 50%;
      top: 24px;
      transform: translateX(-50%);
  `};

  ${({ position }) =>
    position === 'bottom-right' &&
    `
      right: 24px;
      bottom: 24px;
  `};
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.color.white};
  margin-right: 16px;
`;

const Text = styled.div`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.white};
`;

const NotificationComponent = ({ notification, hide }) => {
  const { text, icon, options } = notification;
  const [timer, setTimer] = useState(null);

  const stopTimer = () => {
    if (timer) return;

    clearTimeout(timer);
  };

  const startTimer = () => {
    const {
      options: { timeout },
    } = notification;

    if (timeout === 0) return;

    setTimer(setTimeout(() => hide(stopTimer), timeout));
  };

  useEffectOnce(() => {
    startTimer();
  });

  return (
    <Wrapper position={options.position}>
      {icon && <StyledIcon name={icon} width={20} height={20} />}
      <Text>{text}</Text>
    </Wrapper>
  );
};

export const Notification = memo(NotificationComponent);
