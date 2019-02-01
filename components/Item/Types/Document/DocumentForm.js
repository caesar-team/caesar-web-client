import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { checkError } from 'common/utils/formikUtils';
import { ITEM_WORKFLOW_EDIT_MODE } from 'common/constants';
import {
  Uploader,
  Input,
  Button,
  Select,
  TextArea,
  File,
  Icon,
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

const createInitialValues = (secret, listId, type) => ({
  ...secret,
  listId,
  type,
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

const DocumentForm = ({
  item: { secret, listId, type },
  allLists,
  mode,
  onFinishCreateWorkflow,
  onFinishEditWorkflow,
  onCancelWorkflow,
}) => {
  const isEditMode = mode === ITEM_WORKFLOW_EDIT_MODE;

  const action = isEditMode ? onFinishEditWorkflow : onFinishCreateWorkflow;

  const buttonText = isEditMode ? 'Update' : 'Add';

  const preparedOptions = allLists.map(({ id, label }) => ({
    value: id,
    label,
  }));

  return (
    <Formik
      key="documentForm"
      initialValues={createInitialValues(secret, listId, type)}
      onSubmit={action}
      isInitialValid={schema.isValidSync(
        createInitialValues(secret, listId, type),
      )}
      validationSchema={schema}
      render={({
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
          <FastField
            name="name"
            render={({ field }) => (
              <TitleInput
                {...field}
                onBlur={setFieldTouched}
                placeholder="Enter the title"
                autoFocus
                error={checkError(touched, errors, 'name')}
              />
            )}
          />
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
        </Form>
      )}
    />
  );
};

export default DocumentForm;
