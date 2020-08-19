import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import { Select, Button } from '@caesar/components';
import { schema } from './schema';
import { defaultValues } from './constants';

const Wrapper = styled.div`
  width: 100%;
`;

const Form = styled.form``;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
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
  margin-bottom: 10px;
`;

const Box = styled.div`
  display: flex;
  font-size: 18px;
  line-height: 18px;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  background-color: ${({ theme }) => theme.color.snow};
  position: relative;
  padding: 10px 15px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }

  ${({ isRequired }) =>
    isRequired &&
    `
    &::before {
      content: '●';
      position: absolute;
      top: 0;
      right: 6px;
    }
  `};
`;

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
`;

const RequiredText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
  position: relative;
  padding-left: 20px;

  &::before {
    content: '●';
    position: absolute;
    top: 0;
    left: 6px;
    line-height: 6px;
    color: ${({ theme }) => theme.color.black};
  }
`;

const StyledSelect = styled(Select)`
  border: 1px solid ${({ theme }) => theme.color.gallery};
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 18px;
  padding: 10px 15px;
  height: 40px;

  &:last-child {
    margin-bottom: 10px;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  margin-right: 20px;
`;

const getOptions = headings =>
  headings.map((heading, index) => ({
    value: `${index}`,
    label: heading,
  }));

const FieldsStep = ({ headings, initialValues, onSubmit, onCancel }) => (
  <Formik
    key="fieldsStep"
    initialValues={{ ...defaultValues, ...initialValues }}
    isInitialValid={schema.isValidSync({ ...defaultValues, ...initialValues })}
    onSubmit={onSubmit}
    validationSchema={schema}
  >
    {({ values, setFieldValue, handleSubmit, isSubmitting, isValid }) => (
      <Wrapper>
        <Form onSubmit={handleSubmit}>
          <Title>Match the fields in Caesar with the fields in your file</Title>
          <TwoColumnsWrapper>
            <Column>
              <Label>Caesar fields</Label>
              <Box isRequired>Name</Box>
              <Box>Login</Box>
              <Box>Password</Box>
              <Box>Website</Box>
              <Box>Note</Box>
            </Column>
            <Column>
              <Label>CSV Fields</Label>
              <StyledSelect
                name="name"
                isCancellable
                value={values.name}
                options={getOptions(headings)}
                onChange={setFieldValue}
              />
              <StyledSelect
                name="login"
                isCancellable
                value={values.login}
                options={getOptions(headings)}
                onChange={setFieldValue}
              />
              <StyledSelect
                name="pass"
                isCancellable
                value={values.pass}
                options={getOptions(headings)}
                onChange={setFieldValue}
              />
              <StyledSelect
                name="website"
                isCancellable
                value={values.website}
                options={getOptions(headings)}
                onChange={setFieldValue}
              />
              <StyledSelect
                name="note"
                isCancellable
                value={values.note}
                options={getOptions(headings)}
                onChange={setFieldValue}
              />
            </Column>
          </TwoColumnsWrapper>
          <BottomWrapper>
            <RequiredText>Required fields</RequiredText>
            <ButtonsWrapper>
              <StyledButton color="white" onClick={onCancel}>
                CANCEL
              </StyledButton>
              <Button htmlType="submit" disabled={isSubmitting || !isValid}>
                SUBMIT
              </Button>
            </ButtonsWrapper>
          </BottomWrapper>
        </Form>
      </Wrapper>
    )}
  </Formik>
);

export default FieldsStep;
