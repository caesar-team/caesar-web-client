import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { PasswordInput, Button, Icon } from 'components';
import { checkError } from 'common/utils/formikUtils';
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
  border: 1px solid ${({ theme }) => theme.lightGray};

  ${PasswordInput.InputField} {
    line-height: 20px;
  }

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
  border-right: 1px solid ${({ theme }) => theme.lightGray};
`;

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  letter-spacing: 0.6px;
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
    render={({
      errors,
      touched,
      handleSubmit,
      setFieldTouched,
      isSubmitting,
      isValid,
    }) => (
      <Form onSubmit={handleSubmit}>
        <Row>
          <FastField
            name="password"
            render={({ field }) => (
              <StyledPasswordInput
                {...field}
                onBlur={setFieldTouched}
                placeholder="Password"
                prefix={PasswordInputPrefix}
              />
            )}
          />
          {checkError(touched, errors, 'password') && (
            <Error>{errors.password}</Error>
          )}
        </Row>
        <Row>
          <FastField
            name="confirmPassword"
            render={({ field }) => (
              <StyledPasswordInput
                {...field}
                onBlur={setFieldTouched}
                placeholder="Confirm Password"
                prefix={PasswordInputPrefix}
              />
            )}
          />
          {checkError(touched, errors, 'confirmPassword') && (
            <Error>{errors.confirmPassword}</Error>
          )}
        </Row>
        <ButtonWrapper>
          <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
            Reset
          </StyledButton>
        </ButtonWrapper>
      </Form>
    )}
  />
);

export default ResetPasswordForm;
