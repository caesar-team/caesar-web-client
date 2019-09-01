import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { Head, Icon, LockInput } from 'components';
import { passwordSchema } from './schema';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.emperor};
`;

const Title = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.lightGray};
  margin-bottom: 36px;
  margin-top: 140px;
`;

const StyledLogo = styled(Icon)`
  fill: ${({ theme }) => theme.lightGray};
`;

const MasterPasswordCheckForm = ({ onSubmit }) => (
  <Wrapper>
    <Head title="[LOCKED] Caesar" />
    <StyledLogo name="logo-new" width={210} height={45} />
    <Title>Enter your master password</Title>
    <Formik
      initialValues={{ password: '' }}
      validationSchema={passwordSchema}
      onSubmit={onSubmit}
      validateOnChange={false}
      render={({ errors, handleSubmit, submitForm, resetForm }) => (
        <form onSubmit={handleSubmit}>
          <FastField
            name="password"
            render={({ field }) => (
              <LockInput
                {...field}
                autoFocus
                onClick={submitForm}
                onBackspace={resetForm}
                isError={Object.keys(errors).length !== 0}
              />
            )}
          />
        </form>
      )}
    />
  </Wrapper>
);

export default MasterPasswordCheckForm;
