import React from 'react';
import styled from 'styled-components';
import { CircleLoader } from '../Loader';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.emperor};
  position: absolute;
  bottom: 10px;
  right: 60px;
  z-index: 11;
  border-radius: 3px;
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
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.white};
  margin-left: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 400px;
`;

const IconStyled = styled(Icon)`
  width: 20px;
  height: 20px;
  fill: ${({ theme }) => theme.white};
`;

const CloseIcon = styled(IconStyled)`
  margin-left: 16px;
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const GlobalNotification = ({
  text = 'Your request is in progress...',
  isError = false,
  onClose = Function.prototype,
  className,
}) => (
  <Wrapper className={className}>
    <InnerWrapper>
      {isError ? (
        <IconStyled name="loader-error" />
      ) : (
        <CircleLoader size={16} color="white" />
      )}
      <Text>{text}</Text>
      {isError && <CloseIcon name="close" onClick={onClose} />}
    </InnerWrapper>
  </Wrapper>
);

export default GlobalNotification;
