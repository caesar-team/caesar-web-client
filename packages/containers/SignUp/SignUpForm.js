import React from 'react';
import styled from 'styled-components';
import zxcvbn from 'zxcvbn';
import { Formik, FastField } from 'formik';
import {
  Input,
  PasswordInput,
  Button,
  Icon,
  Tooltip,
  StrengthIndicator,
  PasswordIndicator,
} from '@caesar/components';
import { checkError } from '@caesar/common/utils/formikUtils';
import { GOOD_PASSWORD_RULES } from '@caesar/common/validation/constants';
import { INDICATOR_TYPE } from '@caesar/components/PasswordIndicator';
import { schema } from './schema';

const Form = styled.form`
  width: 100%;
  margin-top: 50px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FieldWrapper = styled.div`
  position: relative;
`;

const StyledEmailInput = styled(Input)`
  display: flex;
  border: 1px solid ${({ theme }) => theme.color.lightGray};

  ${Input.Prefix} {
    position: relative;
    transform: inherit;
    left: inherit;
    top: inherit;
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

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.red};
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

const StyledPasswordIndicator = styled(PasswordIndicator)`
  justify-content: space-between;
  margin-top: 30px;

  ${PasswordIndicator.ScoreName} {
    width: 80px;
    margin-left: 16px;
    text-align: right;
  }
`;

const StyledStrengthIndicator = styled(StrengthIndicator)`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.gray};
  padding: 16px;

  ${StrengthIndicator.Text} {
    margin-bottom: 15px;
  }

  ${StrengthIndicator.HelperText} {
    font-size: ${({ theme }) => theme.font.size.small};
    color: ${({ theme }) => theme.color.gray};
    margin-bottom: 8px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const EmailInputPrefix = (
  <Prefix>
    <Icon name="email" width={18} height={18} />
  </Prefix>
);

const PasswordInputPrefix = (
  <Prefix>
    <Icon name="key-diagonal" width={18} height={18} />
  </Prefix>
);

const SignUpForm = ({ onSubmit }) => (
  <Formik
    key="documentForm"
    onSubmit={onSubmit}
    initialValues={{ email: '', password: '', confirmPassword: '' }}
    validationSchema={schema}
  >
    {({
      values,
      errors,
      touched,
      handleSubmit,
      handleBlur,
      isSubmitting,
      isValid,
    }) => (
      <Form onSubmit={handleSubmit}>
        <Row>
          <FastField name="email">
            {({ field }) => (
              <StyledEmailInput
                {...field}
                onBlur={handleBlur}
                placeholder="Email"
                prefix={EmailInputPrefix}
              />
            )}
          </FastField>
          {checkError(touched, errors, 'email') && (
            <Error>{errors.email}</Error>
          )}
        </Row>
        <Row>
          <FieldWrapper>
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
            <Tooltip
              show={values.password && checkError(touched, errors, 'password')}
              textBoxWidth="280px"
              arrowAlign="top"
              position="right center"
            >
              <StyledStrengthIndicator
                text="Our recommendations for creating a good password:"
                value={values.password}
                rules={GOOD_PASSWORD_RULES}
              />
            </Tooltip>
          </FieldWrapper>
          {values.password && (
            <StyledPasswordIndicator
              type={INDICATOR_TYPE.LINE}
              score={zxcvbn(values.password).score}
            />
          )}
          {checkError(touched, errors, 'password') && (
            <Error>{errors.password}</Error>
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
            <Error>{errors.confirmPassword}</Error>
          )}
        </Row>
        <ButtonWrapper>
          <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
            Sign Up
          </StyledButton>
        </ButtonWrapper>
      </Form>
    )}
  </Formik>
);

export default SignUpForm;
