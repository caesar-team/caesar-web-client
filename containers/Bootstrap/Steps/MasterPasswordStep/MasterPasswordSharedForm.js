import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { checkError } from 'common/utils/formikUtils';
import {
  Head,
  AuthWrapper,
  AuthTitle,
  AuthDescription,
  MasterPasswordInput,
  Link,
  Button,
} from 'components';
import { checkPasswordSchema } from './schema';
import { initialSharedValues } from './constants';

const StyledButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
  margin-top: 45px;
`;

const BottomWrapper = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.gray};
`;

const MasterPasswordSharedForm = ({ onSubmit }) => (
  <Formik
    key="sharedPassword"
    initialValues={initialSharedValues}
    isInitialValid={checkPasswordSchema.isValidSync(initialSharedValues)}
    validationSchema={checkPasswordSchema}
    onSubmit={onSubmit}
    render={({
      errors,
      touched,
      handleSubmit,
      isSubmitting,
      isValid,
      dirty,
    }) => (
      <form onSubmit={handleSubmit}>
        <Head title="Enter master password" />
        <AuthWrapper>
          <AuthTitle>Enter Master Password</AuthTitle>
          <AuthDescription>Enter your master password</AuthDescription>
          <FastField
            name="password"
            render={({ field }) => (
              <MasterPasswordInput
                {...field}
                autoFocus
                error={dirty ? checkError(touched, errors, 'password') : null}
              />
            )}
          />
          <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
            Continue
          </StyledButton>
          <BottomWrapper>
            or <Link to="/logout">log out</Link>
          </BottomWrapper>
        </AuthWrapper>
      </form>
    )}
  />
);

export default MasterPasswordSharedForm;
