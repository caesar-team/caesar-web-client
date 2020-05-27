import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { checkError } from '@caesar/common/utils/formikUtils';
import { ITEM_WORKFLOW_EDIT_MODE } from '@caesar/common/constants';
import {
  Uploader,
  Input,
  PasswordInput,
  Button,
  TextArea,
  File,
  FormInput,
} from '@caesar/components';
import { withNotification } from '../../../Notification';
import { Form } from '../components';
import { schema } from './schema';

const Row = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled(Button)`
  margin-right: 20px;
  text-transform: uppercase;
`;

const SubmitButton = styled(Button)`
  text-transform: uppercase;
`;

const TitleInput = styled(Input)`
  margin-top: 5px;
  margin-bottom: 65px;

  ${Input.InputField} {
    padding: 0;
    font-size: 36px;
    color: ${({ theme }) => theme.color.black};

    &::placeholder {
      padding-left: 8px;
      color: ${({ theme }) => theme.color.lightGray};
    }

    &:focus {
      background-color: ${({ theme }) => theme.color.white};
    }
  }
`;

const FormPasswordInput = styled(PasswordInput)`
  ${Input.InputField} {
    padding: 5px 15px;
    color: ${({ theme }) => theme.color.black};
  }

  ${Input.PostFix} {
    right: 0;
  }
`;

const AdditionalLabel = styled.div`
  position: absolute;
  top: -20px;
  left: 15px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
`;

const AttachmentsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;

const Attachment = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 25px;
`;

const Attachments = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Error = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.color.red};
`;

const createInitialValues = (data, listId, type) => ({
  ...data,
  listId,
  type,
});

const checkAttachmentsError = (errors, index) =>
  errors[index] && errors[index].raw;

const renderAttachments = (attachments = [], errors = [], setFieldValue) =>
  attachments.map((attachment, index) => (
    <FileRow key={index}>
      <File
        key={index}
        status={checkAttachmentsError(errors, index) ? 'error' : 'uploaded'}
        onClickRemove={() =>
          setFieldValue(
            'attachments',
            attachments.filter((_, fileIndex) => index !== fileIndex),
          )
        }
        {...attachment}
      />
      {checkAttachmentsError(errors, index) && (
        <Error>{errors[index].raw}</Error>
      )}
    </FileRow>
  ));

const CredentialsForm = ({
  item: { data, listId, type },
  mode,
  notification,
  onFinishCreateWorkflow,
  onFinishEditWorkflow,
  onCancelWorkflow,
}) => {
  const isEditMode = mode === ITEM_WORKFLOW_EDIT_MODE;

  const action = isEditMode ? onFinishEditWorkflow : onFinishCreateWorkflow;

  const buttonText = isEditMode ? 'Update' : 'Add';

  return (
    <Formik
      key="credentialsForm"
      initialValues={createInitialValues(data, listId, type)}
      onSubmit={action}
      isInitialValid={schema.isValidSync(
        createInitialValues(data, listId, type),
      )}
      validationSchema={schema}
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        isValid,
      }) => (
        <Form onSubmit={handleSubmit}>
          <ButtonWrapper>
            <CancelButton color="white" onClick={onCancelWorkflow}>
              Cancel
            </CancelButton>
            <SubmitButton htmlType="submit" disabled={isSubmitting || !isValid}>
              {buttonText}
            </SubmitButton>
          </ButtonWrapper>
          <FastField name="name">
            {({ field }) => (
              <TitleInput
                {...field}
                onBlur={setFieldTouched}
                placeholder="Enter the title"
                autoFocus
                error={checkError(touched, errors, 'name')}
              />
            )}
          </FastField>
          <Row>
            <FastField name="login">
              {({ field }) => (
                <FormInput
                  {...field}
                  onBlur={setFieldTouched}
                  label="Login"
                  withBorder
                  error={checkError(touched, errors, 'login')}
                />
              )}
            </FastField>
          </Row>
          <Row>
            <FastField name="pass">
              {({ field }) => (
                <FormPasswordInput
                  {...field}
                  onBlur={setFieldTouched}
                  withBorder
                  label="Password"
                  error={checkError(touched, errors, 'pass')}
                />
              )}
            </FastField>
          </Row>
          <Row>
            <FastField name="website">
              {({ field }) => (
                <FormInput
                  {...field}
                  onBlur={setFieldTouched}
                  withBorder
                  label="Website"
                  error={checkError(touched, errors, 'website')}
                />
              )}
            </FastField>
          </Row>
          <Row>
            <AdditionalLabel>Notes</AdditionalLabel>
            <FastField name="note">
              {({ field }) => <TextArea {...field} />}
            </FastField>
          </Row>
          <AttachmentsSection>
            <Attachment>Attachments</Attachment>
            <Uploader
              multiple
              asPreview
              notification={notification}
              name="attachments"
              files={values.attachments}
              error={
                typeof errors?.attachments === 'string'
                  ? errors.attachments
                  : ''
              }
              onChange={setFieldValue}
            />
            <Attachments>
              {renderAttachments(
                values.attachments,
                errors.attachments,
                setFieldValue,
              )}
            </Attachments>
          </AttachmentsSection>
        </Form>
      )}
    </Formik>
  );
};

export default withNotification(CredentialsForm);
