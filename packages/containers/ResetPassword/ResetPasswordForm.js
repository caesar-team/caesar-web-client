import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { PasswordInput, Button, Icon, TextError } from '@caesar/components';
import { checkError } from '@caesar/common/utils/formikUtils';
import { schema } from './schema';

const Form = styled.form`
  width: 100%;
  margin-top: 50px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledPasswordInput = styled(PasswordInput)`
  display: flex;
  border: 1px solid ${({ theme }) => theme.color.lightGray};

  ${PasswordInput.Prefix} {
    position: relative;
    transform: inherit;
    left: inherit;
    top: inherit;
  }
`;

const Prefix = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${({ theme }) => theme.color.lightGray};
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  padding: 18px 30px;
  height: 60px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 60px;
`;

const PasswordInputPrefix = (
  <Prefix>
    <Icon name="key-diagonal" width={18} height={18} />
  </Prefix>
);

const ResetPasswordForm = ({ onSubmit }) => (
  <Formik
    key="documentForm"
    onSubmit={onSubmit}
    initialValues={{ password: '', confirmPassword: '' }}
    validationSchema={schema}
  >
    {({ errors, touched, handleSubmit, handleBlur, isSubmitting, isValid }) => (
      <Form onSubmit={handleSubmit}>
        <Row>
          <FastField name="password">
            {({ field }) => (
              <StyledPasswordInput
                {...field}
                onBlur={handleBlur}
                placeholder="Password"
                prefix={PasswordInputPrefix}
              />
            )}
          </FastField>
          {checkError(touched, errors, 'password') && (
            <TextError marginTop={8}>{errors.password}</TextError>
          )}
        </Row>
        <Row>
          <FastField name="confirmPassword">
            {({ field }) => (
              <StyledPasswordInput
                {...field}
                onBlur={handleBlur}
                placeholder="Confirm Password"
                prefix={PasswordInputPrefix}
              />
            )}
          </FastField>
          {checkError(touched, errors, 'confirmPassword') && (
            <TextError marginTop={8}>{errors.confirmPassword}</TextError>
          )}
        </Row>
        <ButtonWrapper>
          <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
            Reset
          </StyledButton>
        </ButtonWrapper>
      </Form>
    )}
  </Formik>
);

export default ResetPasswordForm;
