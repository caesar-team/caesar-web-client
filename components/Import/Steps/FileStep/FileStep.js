import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { Uploader } from '../../../Uploader';
import { schema } from './schema';

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

const FileStep = ({ type, onSubmit }) => (
  <Formik
    key="fileStep"
    initialValues={{ files: [] }}
    onSubmit={onSubmit}
    validationSchema={schema}
    render={({ values, errors, setFieldValue, handleSubmit, submitForm }) => (
      <Wrapper>
        <Form onSubmit={handleSubmit}>
          <Title>Upload your {type} file</Title>
          <Uploader
            name="file"
            accept="text/csv"
            files={values.files}
            extText={`*.csv file for ${type}`}
            onChange={(name, files) => {
              setFieldValue('files', files);
              submitForm();
            }}
          />
        </Form>
      </Wrapper>
    )}
  />
);

export default FileStep;
