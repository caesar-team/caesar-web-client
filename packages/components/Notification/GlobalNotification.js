import React, { memo } from 'react';
import styled from 'styled-components';
import { CircleLoader } from '../Loader';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  background-color: ${({ isError, theme }) =>
    isError ? theme.color.snow : theme.color.emperor};
  position: absolute;
  bottom: 10px;
  right: 60px;
  z-index: ${({ theme }) => theme.zIndex.notification};
  ${({ isError, theme }) =>
    isError &&
    `
    border: 1px solid ${theme.color.gallery}
  `};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  position: relative;
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ isError, theme }) =>
    isError ? theme.color.red : theme.color.white};
  margin-left: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 400px;
`;

const StyledIcon = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const CloseIcon = styled(Icon)`
  margin-left: 16px;
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const GlobalNotificationComponent = ({
  text = 'Your request is in progress...',
  isError = false,
  onClose = Function.prototype,
  className,
}) => (
  <Wrapper className={className} isError={isError}>
    <InnerWrapper>
      {isError ? (
        <StyledIcon name="loader-error" color="red" />
      ) : (
        <CircleLoader size={16} color="white" />
      )}
      <Text isError={isError}>{text}</Text>
      {isError && <CloseIcon name="close" color="gray" onClick={onClose} />}
    </InnerWrapper>
  </Wrapper>
);

export const GlobalNotification = memo(GlobalNotificationComponent);
