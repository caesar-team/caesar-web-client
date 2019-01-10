import React from 'react';
import styled from 'styled-components';
import PasswordInput from './PasswordInput';
import StrengthIndicator from './StrengthIndicator';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  border: 1px solid
    ${({ theme, isError }) => (isError ? theme.red : theme.gallery)};
  border-radius: 3px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 60px;
  border-right: 1px solid
    ${({ theme, isError }) => (isError ? theme.red : theme.gallery)};
`;

const StyledPasswordInput = styled(PasswordInput)`
  ${PasswordInput.InputField} {
    height: 58px;
    width: 100%;
  }
`;

const StyledStrengthIndicator = styled(StrengthIndicator)`
  margin-top: 40px;
`;

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

const MasterPasswordInput = ({ withIndicator = false, error, ...props }) => {
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
      {withIndicator && (
        <StyledStrengthIndicator value={props.value} rules={props.rules} />
      )}
    </Wrapper>
  );
};

export default MasterPasswordInput;
