import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { checkError } from 'common/utils/formikUtils';
import {
  BackButtonWrapper,
  BackButton,
  AuthTitle,
  AuthDescription,
  MasterPasswordInput,
  Button,
} from 'components';
import { createConfirmPasswordSchema } from './schema';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
  margin-top: 45px;
`;

const MasterPasswordConfirmForm = ({
  masterPassword,
  onSubmit,
  onClickReturn,
}) => (
  <Formik
    key="confirmPassword"
    initialValues={{ confirmPassword: '' }}
    validationSchema={createConfirmPasswordSchema(masterPassword)}
    onSubmit={onSubmit}
    render={({ errors, touched, handleSubmit, isSubmitting, isValid }) => (
      <Form onSubmit={handleSubmit}>
        <BackButtonWrapper>
          <BackButton onClick={onClickReturn}>
            Back to the previous step
          </BackButton>
        </BackButtonWrapper>
        <AuthTitle>Сonfirmation</AuthTitle>
        <AuthDescription>Confirm your master password</AuthDescription>
        <FastField
          name="confirmPassword"
          render={({ field }) => (
            <MasterPasswordInput
              {...field}
              autoFocus
              error={checkError(touched, errors, 'confirmPassword')}
            />
          )}
        />
        <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
          Confirm
        </StyledButton>
      </Form>
    )}
  />
);

export default MasterPasswordConfirmForm;
