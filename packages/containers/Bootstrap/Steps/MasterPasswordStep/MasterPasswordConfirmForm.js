import React from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { useEffectOnce } from 'react-use';
import { checkError } from '@caesar/common/utils/formikUtils';
import {
  AuthTitle,
  AuthDescription,
  MasterPasswordInput,
  Button,
} from '@caesar/components';
import { createConfirmPasswordSchema } from "./schema";
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

const  MasterPasswordConfirmForm = ({
  masterPassword,
  onSubmit,
  onClickReturn,
}) => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    validateForm,
  } = useFormik({
    initialValues: { confirmPassword: '' },
    validationSchema: createConfirmPasswordSchema(masterPassword),
    onSubmit,
  });
  useEffectOnce(() => {
    validateForm();
  });

  return (
    <Form onSubmit={handleSubmit}>
      <AuthTitle>Confirmation</AuthTitle>
      <AuthDescription>Confirm your master password</AuthDescription>
      <MasterPasswordInput
        name="confirmPassword"
        value={values.confirmPassword}
        autoFocus
        isAlwaysVisibleIcon
        placeholder="Repeat password…"
        error={dirty ? checkError(touched, errors, 'confirmPassword') : null}
        onChange={handleChange}
        onBlur={handleBlur}        
      />
      <ButtonsWrapper>
        <BackLink disabled={isSubmitting} onClick={onClickReturn}>
          Change password
        </BackLink>
        <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
          Confirm
        </StyledButton>
      </ButtonsWrapper>      
    </Form>
  );
};

export default MasterPasswordConfirmForm;
