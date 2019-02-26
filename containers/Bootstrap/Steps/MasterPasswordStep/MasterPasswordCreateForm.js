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
import { passwordSchema } from './schema';
import { REGEXP_TEXT_MATCH } from '../../constants';
import { initialMasterPasswordValues } from './constants';

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

const MasterPasswordCreateForm = ({ onSubmit }) => (
  <Formik
    key="password"
    initialValues={initialMasterPasswordValues}
    isInitialValid={passwordSchema.isValidSync(initialMasterPasswordValues)}
    validationSchema={passwordSchema}
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
        <Head title="Create master password for Caesar" />
        <AuthWrapper>
          <AuthTitle>Master Password</AuthTitle>
          <AuthDescription>Create master password for Caesar</AuthDescription>
          <FastField
            name="password"
            render={({ field }) => (
              <MasterPasswordInput
                {...field}
                autoFocus
                withIndicator
                rules={REGEXP_TEXT_MATCH}
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

export default MasterPasswordCreateForm;
