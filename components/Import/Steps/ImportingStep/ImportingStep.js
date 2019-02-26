import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';

const Wrapper = styled.div``;

const ImportingStep = ({ onSubmit }) => (
  <Formik
    key="importingStep"
    onSubmit={onSubmit}
    render={({
      values,
      errors,
      touched,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
      isSubmitting,
      isValid,
    }) => <Wrapper />}
  />
);

export default ImportingStep;
