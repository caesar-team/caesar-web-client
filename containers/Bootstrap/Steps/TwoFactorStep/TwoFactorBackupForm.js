import React from 'react';
import styled from 'styled-components';
import { FastField, Formik } from 'formik';
import { Checkbox } from 'components/Checkbox';
import { backupInitialValues } from './constants';
import { agreeSchema } from './schema';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TwoFactorBackupForm = ({ codes, onSubmit }) => (
  <Formik
    key="backupCodes"
    initialValues={backupInitialValues}
    validationSchema={agreeSchema}
    onSubmit={onSubmit}
    render={({
      errors,
      handleSubmit,
      isSubmitting,
      setFieldValue,
      submitForm,
      resetForm,
    }) => (
      <Form onSubmit={handleSubmit}>
        <FastField
          name="agreeCheck"
          render={({ field }) => (
            <Checkbox {...field} checked={field.value}>
              I have printed or saved these codes
            </Checkbox>
          )}
        />
      </Form>
    )}
  />
);

export default TwoFactorBackupForm;
