import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { LogoCaesarDomain, LockInput } from '@caesar-ui';
import { passwordSchema } from './schema';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.emperor};
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
  color: ${({ theme }) => theme.color.lightGray};
  margin: 32px 0;
`;

const MasterPassword = ({ onSubmit }) => (
  <Wrapper>
    <InnerWrapper>
      <LogoCaesarDomain color="white" width={146} height={45} />
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
