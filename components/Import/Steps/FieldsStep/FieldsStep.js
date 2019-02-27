import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import { schema } from './schema';
import { initialValues } from './constants';
import { Select } from '../../../Select';
import { Button } from '../../../Button';

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
  line-height: 18px;
  letter-spacing: 0.6px;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.gallery};
  background-color: ${({ theme }) => theme.snow};
  position: relative;
  padding: 10px 15px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }

  ${({ isRequired }) =>
    isRequired &&
    `
    &:before {
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
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
  position: relative;
  padding-left: 20px;

  &:before {
    content: '●';
    position: absolute;
    top: 0;
    left: 6px;
    line-height: 6px;
    color: ${({ theme }) => theme.black};
  }
`;

const StyledSelect = styled(Select)`
  border: 1px solid ${({ theme }) => theme.gallery};
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

const OPTIONS = [{ value: 1, label: 'one' }, { value: 2, label: 'two' }];

const FieldsStep = ({ options = OPTIONS, onSubmit }) => (
  <Formik
    key="fieldsStep"
    initialValues={initialValues}
    onSubmit={onSubmit}
    validationSchema={schema}
    render={({
      values,
      setFieldValue,
      handleSubmit,
      isSubmitting,
      isValid,
    }) => (
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
              <StyledSelect
                name="title"
                value={values.title}
                options={options}
                onChange={setFieldValue}
              />
              <StyledSelect
                name="login"
                value={values.login}
                options={options}
                onChange={setFieldValue}
              />
              <StyledSelect
                name="password"
                value={values.password}
                options={options}
                onChange={setFieldValue}
              />
              <StyledSelect
                name="website"
                value={values.website}
                options={options}
                onChange={setFieldValue}
              />
              <StyledSelect
                name="note"
                value={values.note}
                options={options}
                onChange={setFieldValue}
              />
            </Column>
          </TwoColumnsWrapper>
          <BottomWrapper>
            <RequiredText>Required fields</RequiredText>
            <ButtonsWrapper>
              <StyledButton color="white">CANCEL</StyledButton>
              <Button htmlType="submit" disabled={isSubmitting || !isValid}>
                SUBMIT
              </Button>
            </ButtonsWrapper>
          </BottomWrapper>
        </Form>
      </Wrapper>
    )}
  />
);

export default FieldsStep;
