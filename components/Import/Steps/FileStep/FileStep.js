import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { Uploader } from '../../../Uploader';

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.6px;
  margin-bottom: 25px;
`;

const FileStep = ({ onSubmit }) => (
  <Formik
    key="fileStep"
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
    }) => (
      <Wrapper>
        <Title>Upload your 1Password file</Title>
        <Uploader
          name="file"
          files={values.file}
          extText="*.1pif file for 1Password "
          onChange={setFieldValue}
        />
      </Wrapper>
    )}
  />
);

export default FileStep;
