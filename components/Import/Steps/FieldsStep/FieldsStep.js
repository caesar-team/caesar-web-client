import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { schema } from '../FileStep/schema';
import { Uploader } from '../../../Uploader';

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

const TwoColumnsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 30px;

  &:last-child {
    margin-right: 0;
  }
`;

const Label = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  margin-bottom: 10px;
`;

const Box = styled.div`
  display: flex;
  font-size: 18px;
  letter-spacing: 0.6px;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.gallery};
  background-color: ${({ theme }) => theme.snow};
  position: relative;
  padding: 8px 15px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }

  ${({ isRequired }) =>
    isRequired &&
    `
    &::before {
      content: '●'
      position: absolute;
      top: 0;
      right: 0;
    }
  `};
`;

const FieldsStep = ({ onSubmit }) => (
  <Formik
    key="fieldsStep"
    initialValues={{ file: null }}
    onSubmit={onSubmit}
    validationSchema={schema}
    render={({ values, errors, setFieldValue, handleSubmit, submitForm }) => (
      <Wrapper>
        <Form onSubmit={handleSubmit}>
          <Title>Match the fields in Caesar with the fields in your file</Title>
          <TwoColumnsWrapper>
            <Column>
              <Label>Caesar fields</Label>
              <Box isRequired>Title</Box>
              <Box isRequired>Login</Box>
              <Box isRequired>Password</Box>
              <Box>Website</Box>
              <Box>Note</Box>
            </Column>
            <Column>
              <Label>CSV Fields</Label>
            </Column>
          </TwoColumnsWrapper>
        </Form>
      </Wrapper>
    )}
  />
);

export default FieldsStep;
