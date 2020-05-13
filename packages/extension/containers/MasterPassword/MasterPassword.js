import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { Icon, LockInput } from '@caesar-ui';
import { passwordSchema } from './schema';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.emperor};
  width: 100%;
  height: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 282px;
`;

const Title = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.lightGray};
  margin: 32px 0;
`;

const StyledLogo = styled(Icon)`
  fill: ${({ theme }) => theme.white};
`;

const MasterPassword = ({ onSubmit }) => (
  <Wrapper>
    <InnerWrapper>
      <StyledLogo name="logo-caesar-4xxi" width={210} height={45} />
      <Title>Enter your master password</Title>
      <Formik
        initialValues={{ password: '' }}
        validationSchema={passwordSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
      >
        {({ errors, handleSubmit, submitForm, resetForm }) => (
          <form onSubmit={handleSubmit}>
            <FastField name="password">
              {({ field }) => (
                <LockInput
                  {...field}
                  autoFocus
                  onClick={submitForm}
                  onBackspace={resetForm}
                  isError={Object.keys(errors).length !== 0}
                />
              )}
            </FastField>
          </form>
        )}
      </Formik>
    </InnerWrapper>
  </Wrapper>
);

export default MasterPassword;
