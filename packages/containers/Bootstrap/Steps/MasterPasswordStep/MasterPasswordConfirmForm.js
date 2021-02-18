import React from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { useEffectOnce } from 'react-use';
import { checkError } from '@caesar/common/utils/formikUtils';
import { useMedia } from '@caesar/common/hooks';
import {
  AuthTitle,
  AuthDescription,
  MasterPasswordInput,
  Button,
} from '@caesar/components';
import { createConfirmPasswordSchema } from './schema';
import { BackLink } from '../../components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledButton = styled(Button)`
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
  const { isMobile, isWideMobile } = useMedia();

  useEffectOnce(() => {
    validateForm();
  });

  return (
    <Form onSubmit={handleSubmit}>
      <AuthTitle>Confirmation</AuthTitle>
      <AuthDescription isCompact={isMobile || isWideMobile}>
        Confirm your master password
      </AuthDescription>
      <MasterPasswordInput
        name="confirmPassword"
        value={values.confirmPassword}
        autoFocus
        isAlwaysVisibleIcon
        placeholder="Repeat password…"
        error={checkError(touched, errors, 'confirmPassword')}
        onChange={handleChange}
        onBlur={handleBlur}        
      />
      <ButtonsWrapper>
        <BackLink disabled={isSubmitting} onClick={onClickReturn}>
          Change password
        </BackLink>
        <StyledButton
          htmlType="submit"
          isHigh={!isMobile && !isWideMobile}
          isUpperCase          
          disabled={isSubmitting || !isValid}
        >
          Confirm
        </StyledButton>
      </ButtonsWrapper>      
    </Form>
  );
};

export default MasterPasswordConfirmForm;
