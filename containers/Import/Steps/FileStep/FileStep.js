import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import { Uploader } from 'components';
import { createSchema } from './schema';

const Wrapper = styled.div`
  width: 100%;
`;

const Form = styled.form``;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.6px;
  margin-bottom: 25px;
`;

const initialValues = {
  file: {},
};

const FileStep = ({ onSubmit }) => (
  <Formik
    key="fileStep"
    initialValues={initialValues}
    onSubmit={onSubmit}
    validationSchema={createSchema('csv')}
    render={({ values, errors, setFieldValue, handleSubmit, submitForm }) => (
      <Wrapper>
        <Form onSubmit={handleSubmit}>
          <Title>Upload your CSV file</Title>
          <Uploader
            name="file"
            accept="text/csv"
            files={values.file}
            extText="*.csv file"
            error={errors.file ? errors.file.name || errors.file.raw : null}
            onChange={(name, file) => {
              setFieldValue('file', file);
              submitForm();
            }}
          />
        </Form>
      </Wrapper>
    )}
  />
);

export default FileStep;
