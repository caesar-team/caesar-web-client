import React from 'react';
import styled from 'styled-components';
import PasswordInput from './PasswordInput';
import { Icon } from '../Icon';
import { TextError } from '../Error';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  border: 1px solid
    ${({ theme, isError }) => (isError ? theme.color.red : theme.color.gallery)};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 60px;
  min-width: 60px;
  border-right: 1px solid
    ${({ theme, isError }) => (isError ? theme.color.red : theme.color.gallery)};
`;

const StyledPasswordInput = styled(PasswordInput)`
  ${PasswordInput.InputField} {
    height: 58px;
    width: 100%;
  }
`;

const Error = styled(TextError)`
  position: absolute;
  top: 68px;
`;

const MasterPasswordInput = ({ error, ...props }) => {
  const isError = !!error;

  return (
    <Wrapper>
      <InnerWrapper isError={isError}>
        <IconWrapper isError={isError}>
          <Icon name="key-diagonal" width={20} height={20} />
        </IconWrapper>
        <StyledPasswordInput {...props} />
      </InnerWrapper>
      {isError && <Error>{error}</Error>}
    </Wrapper>
  );
};

export default MasterPasswordInput;
