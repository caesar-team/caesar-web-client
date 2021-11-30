import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { useMedia } from '@caesar/common/hooks';
import {
  Input,
  PasswordInput,
  Button,
  Icon,
  Link,
  TextError,
} from '@caesar/components';
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

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const StyledLink = styled(Link)`
  font-size: 14px;
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

const SignInForm = ({ onSubmit }) => {
  const { isDesktop, isWideDesktop } = useMedia();

  return (
    <Formik
      key="documentForm"
      onSubmit={onSubmit}
      initialValues={{ email: '', password: '' }}
      validationSchema={schema}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ errors, touched, handleSubmit, handleBlur, isSubmitting }) => (
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
              <TextError marginTop={8}>{errors.email}</TextError>
            )}
          </Row>
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
          <ButtonWrapper>
            {/* <StyledLink>Forgot password?</StyledLink> */}
            <Button
              htmlType="submit"
              isHigh={isDesktop || isWideDesktop}
              isUppercase
              disabled={isSubmitting}
            >
              Login
            </Button>
          </ButtonWrapper>
        </Form>
      )}
    </Formik>
  );
}

export default SignInForm;
