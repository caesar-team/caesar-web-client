import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import { Uploader } from '@caesar/components';
import { createSchema } from './schema';

const Wrapper = styled.div`
  width: 100%;
`;

const Form = styled.form``;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 25px;
`;

const initialValues = {
  file: undefined,
};

const FileStep = ({ onSubmit, ...props }) => {
  return (
    <Formik
      key="fileStep"
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={createSchema('csv')}
    >
      {({ values, errors, setFieldValue, handleSubmit, submitForm }) => {
        return (
          <Wrapper>
            <Form onSubmit={handleSubmit}>
              <Title>Upload your CSV file</Title>
              <Uploader
                name="file"
                files={values.file}
                extText="*.csv file"
                error={errors.file ? errors.file.name || errors.file.raw : null}
                onChange={(name, file) => {
                  setFieldValue('file', file);
                  submitForm().then();
                }}
              />
            </Form>
          </Wrapper>
        );
      }}
    </Formik>
  );
};

export default FileStep;
