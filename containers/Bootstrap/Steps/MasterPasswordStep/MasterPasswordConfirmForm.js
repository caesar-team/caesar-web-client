import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { checkError } from 'common/utils/formikUtils';
import {
  AuthTitle,
  AuthDescription,
  MasterPasswordInput,
  Button,
} from 'components';
import { createConfirmPasswordSchema } from './schema';
import { BackLink } from '../../components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledButton = styled(Button)`
  height: 60px;
  font-size: 18px;
  width: 130px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
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
        <AuthTitle>Сonfirmation</AuthTitle>
        <AuthDescription>
          Confirm your master password
        </AuthDescription>
        <FastField
          name="confirmPassword"
          render={({ field }) => (
            <MasterPasswordInput
              {...field}
              autoFocus
              isAlwaysVisibleIcon
              placeholder="Repeat password…"
              error={checkError(touched, errors, 'confirmPassword')}
            />
          )}
        />
        <ButtonsWrapper>
          <BackLink onClick={onClickReturn}>Change password</BackLink>
          <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
            Confirm
          </StyledButton>
        </ButtonsWrapper>
      </Form>
    )}
  />
);

export default MasterPasswordConfirmForm;
