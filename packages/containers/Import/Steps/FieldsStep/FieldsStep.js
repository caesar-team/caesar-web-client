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
  margin-bottom: 24px;
  font-weight: 600;
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
  margin-bottom: 8px;
`;

const Box = styled.div`
  position: relative;
  display: flex;
  height: 40px;
  padding: 8px 16px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.color.snow};
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: ${({ theme }) => theme.borderRadius};

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
  position: relative;
  padding-left: 20px;
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.gray};

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
  margin-bottom: 8px;
  border: 1px solid ${({ theme }) => theme.color.gallery};

  ${Select.SelectedOption} {
    height: 40px;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledButton = styled(Button)`
  margin-left: 16px;
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
                name="password"
                isCancellable
                value={values.password}
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
                Cancel
              </StyledButton>
              <StyledButton
                htmlType="submit"
                disabled={isSubmitting || !isValid}
              >
                Submit
              </StyledButton>
            </ButtonsWrapper>
          </BottomWrapper>
        </Form>
      </Wrapper>
    )}
  </Formik>
);

export default FieldsStep;
