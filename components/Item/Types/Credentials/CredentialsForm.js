import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { checkError } from 'common/utils/formikUtils';
import { ITEM_WORKFLOW_EDIT_MODE } from 'common/constants';
import {
  Uploader,
  Input,
  PasswordInput,
  Label,
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
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;

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
  margin-bottom: 60px;

  ${Input.InputField} {
    padding: 0;
    font-size: 36px;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.black};
  }
`;

const FormPasswordInput = styled(PasswordInput)`
  ${Input.InputField} {
    padding: 0 15px 10px;
    color: ${({ theme }) => theme.black};
    border-bottom: 1px solid ${({ theme }) => theme.gallery};
  }

  ${Input.PostFix} {
    right: 0;
  }
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
  margin-top: 20px;
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
  item: { secret, listId },
  allLists,
  mode,
  onFinishCreateWorkflow,
  onFinishEditWorkflow,
  onCancelWorkflow,
  onClickMoveToTrash,
}) => {
  const isEditMode = mode === ITEM_WORKFLOW_EDIT_MODE;

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
            <Label>Login</Label>
            <FastField
              name="login"
              render={({ field }) => (
                <FormInput
                  {...field}
                  error={checkError(touched, errors, 'login')}
                />
              )}
            />
          </Row>
          <Row>
            <Label>Password</Label>
            <FastField
              name="pass"
              render={({ field }) => (
                <FormPasswordInput
                  {...field}
                  error={checkError(touched, errors, 'pass')}
                />
              )}
            />
          </Row>
          <Row>
            <Label>Website</Label>
            <FastField
              name="website"
              render={({ field }) => (
                <FormInput
                  {...field}
                  error={checkError(touched, errors, 'website')}
                />
              )}
            />
          </Row>
          <Row>
            <Label>List</Label>
            <Select
              name="listId"
              placeholder="Select option"
              value={values.listId}
              options={preparedOptions}
              onChange={setFieldValue}
            />
          </Row>
          <Row>
            <Label>Note</Label>
            <FastField
              name="note"
              render={({ field }) => <TextArea {...field} />}
            />
          </Row>
          <AttachmentsSection>
            <Attachment>Attachments</Attachment>
            <Uploader name="attachments" onChange={setFieldValue} />
            <Attachments>
              {renderAttachments(values, setFieldValue)}
            </Attachments>
          </AttachmentsSection>
          {shouldShowRemoveButton && (
            <RemoveButtonWrapper>
              <Button color="white" icon="trash" onClick={onClickMoveToTrash}>
                REMOVE
              </Button>
            </RemoveButtonWrapper>
          )}
        </Form>
      )}
    />
  );
};

export default CredentialsForm;
