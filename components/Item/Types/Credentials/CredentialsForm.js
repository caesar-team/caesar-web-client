import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { checkError } from 'common/utils/formikUtils';
import { POST_WORKFLOW_EDIT_MODE } from 'common/constants';
import {
  Uploader,
  Input,
  PasswordInput,
  Button,
  Select,
  TextArea,
  File,
  Icon,
  FormInput,
} from 'components';
import { schema } from './schema';

const Form = styled.form``;

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
    letter-spacing: 1px;
    color: ${({ theme }) => theme.black};

    &::placeholder {
      padding-left: 8px;
      color: ${({ theme }) => theme.lightGray};
    }

    &:focus {
      background-color: ${({ theme }) => theme.white};
    }
  }
`;

const FormPasswordInput = styled(PasswordInput)`
  ${Input.InputField} {
    padding: 5px 15px;
    color: ${({ theme }) => theme.black};
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
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const AttachmentsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;

const Attachment = styled.div`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 25px;
`;

const Attachments = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const FileRow = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledCloseIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
  margin-left: 10px;
  cursor: pointer;
`;

const RemoveButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
`;

const StyledRemoveButton = styled(Button)`
  padding-right: 15px;
  padding-left: 15px;
  text-transform: uppercase;
`;

const createInitialValues = (secret, listId) => ({
  ...secret,
  listId,
});

const renderAttachments = ({ attachments = [] }, setFieldValue) =>
  attachments.map((attachment, index) => (
    <FileRow key={index}>
      <File key={index} {...attachment} />
      <StyledCloseIcon
        name="close"
        width={10}
        height={10}
        onClick={() =>
          setFieldValue(
            'attachments',
            attachments.filter((_, fileIndex) => index !== fileIndex),
          )
        }
      />
    </FileRow>
  ));

const CredentialsForm = ({
  post: { secret, listId },
  allLists,
  mode,
  onFinishCreateWorkflow,
  onFinishEditWorkflow,
  onCancelWorkflow,
  onClickMoveToTrash,
}) => {
  const isEditMode = mode === POST_WORKFLOW_EDIT_MODE;

  const action = isEditMode ? onFinishEditWorkflow : onFinishCreateWorkflow;

  const buttonText = isEditMode ? 'Update' : 'Add';
  const shouldShowRemoveButton = isEditMode;

  const preparedOptions = allLists.map(({ id, label }) => ({
    value: id,
    label,
  }));

  return (
    <Formik
      key="credentialsForm"
      initialValues={createInitialValues(secret, listId)}
      onSubmit={action}
      isInitialValid={schema.isValidSync(createInitialValues(secret, listId))}
      validationSchema={schema}
      render={({
        values,
        errors,
        touched,
        handleSubmit,
        setFieldValue,
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
          <FastField
            name="name"
            render={({ field }) => (
              <TitleInput
                {...field}
                placeholder="Enter the title"
                autoFocus
                error={checkError(touched, errors, 'name')}
              />
            )}
          />
          <Row>
            <FastField
              name="login"
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Login"
                  withBorder
                  error={checkError(touched, errors, 'login')}
                />
              )}
            />
          </Row>
          <Row>
            <FastField
              name="pass"
              render={({ field }) => (
                <FormPasswordInput
                  {...field}
                  withBorder
                  label="Password"
                  error={checkError(touched, errors, 'pass')}
                />
              )}
            />
          </Row>
          <Row>
            <FastField
              name="website"
              render={({ field }) => (
                <FormInput
                  {...field}
                  withBorder
                  label="Website"
                  error={checkError(touched, errors, 'website')}
                />
              )}
            />
          </Row>
          <Row>
            <AdditionalLabel>List</AdditionalLabel>
            <Select
              name="listId"
              placeholder="Select option"
              value={values.listId}
              options={preparedOptions}
              onChange={setFieldValue}
            />
          </Row>
          <Row>
            <AdditionalLabel>Notes</AdditionalLabel>
            <FastField
              name="note"
              render={({ field }) => <TextArea {...field} />}
            />
          </Row>
          <AttachmentsSection>
            <Attachment>Attachments</Attachment>
            <Uploader
              name="attachments"
              files={values.attachments}
              multiple
              onChange={setFieldValue}
            />
            <Attachments>
              {renderAttachments(values, setFieldValue)}
            </Attachments>
          </AttachmentsSection>
          {shouldShowRemoveButton && (
            <RemoveButtonWrapper>
              <StyledRemoveButton
                color="white"
                icon="trash"
                onClick={onClickMoveToTrash}
              >
                Remove
              </StyledRemoveButton>
            </RemoveButtonWrapper>
          )}
        </Form>
      )}
    />
  );
};

export default CredentialsForm;
