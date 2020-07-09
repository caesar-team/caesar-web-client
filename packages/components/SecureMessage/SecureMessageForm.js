import React, { useState } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { media } from '@caesar/assets/styles/media';
import {
  Checkbox,
  TextArea,
  PasswordInput,
  File,
  Button,
  withNotification,
  withOfflineDetection,
  Hint,
} from '@caesar/components';
import { Select } from '@caesar/components/Select';
import { checkError } from '@caesar/common/utils/formikUtils';
import { downloadFile } from '@caesar/common/utils/file';
import { useMedia } from '@caesar/common/hooks';
import { Uploader } from '../Uploader';
import {
  initialValues,
  requestsLimitOptions,
  secondsLimitOptions,
} from './constants';
import { schema } from './schema';

const Form = styled.form`
  width: 100%;
`;

const Row = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }

  ${media.desktop`
    margin-bottom: 16px;
  `}

  ${media.mobile`
    margin-bottom: 8px;
  `}
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ColumnStyled = styled(Column)`
  margin-left: 16px;
`;

const Label = styled.div`
  margin-bottom: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.color.gray};

  ${media.desktop`
    margin-bottom: 8px;
    font-size: 14px;
  `}
`;

const InputStyled = styled(PasswordInput)`
  border-radius: 3px;
  border: solid 1px ${({ theme }) => theme.color.gallery};
`;

const TextAreaStyled = styled(TextArea)`
  ${TextArea.TextAreaField} {
    background: ${({ theme }) => theme.color.white};
  }
`;

const Error = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.red};
`;

const AttachmentsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-bottom: 40px;

  ${media.desktop`
    margin-top: 16px;
    margin-bottom: 16px;
  `}

  ${media.mobile`
    margin-top: 8px;
    margin-bottom: 8px;
  `}
`;

const StyledUploader = styled(Uploader)`
  padding: 24px 5px;

  ${media.desktop`
    padding: 16px 5px;
  `}
`;

const Attachments = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-gap: 24px;
  padding-top: 8px;

  ${media.wideMobile`
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-gap: 16px;
  `}

  ${media.mobile`
    grid-template-columns: minmax(0, 1fr);
    grid-gap: 8px;
  `}
`;

const FileRow = styled.div`
  &[disabled] {
    pointer-events: none;
  }
`;

const SelectRow = styled.div`
  display: flex;
  width: 100%;
  margin-top: 38px;
  margin-bottom: 40px;

  ${media.desktop`
    margin-top: 22px;
    margin-bottom: 24px;
  `}

  ${media.wideMobile`
    margin-top: 14px;
    margin-bottom: 16px;
  `}
`;

const StyledSelect = styled(Select)`
  height: 40px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: 3px;

  ${Select.ValueText} {
    padding: 0;
    font-size: 16px;
    font-weight: 600;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 40px 0;

  ${media.desktop`
    margin: 24px 0;
  `}

  ${media.wideMobile`
    margin: 16px 0;
  `}
`;

const StyledButton = styled(Button)`
  ${media.mobile`
    width: 100%;
  `}
`;

const handleClickDownloadFile = attachment => {
  const { raw, name } = attachment;

  downloadFile(raw, name);
};

const checkAttachmentsError = (errors, index) =>
  errors[index] && errors[index].raw;

const renderAttachments = (
  attachments = [],
  errors = [],
  setFieldValue,
  isSubmitting,
) =>
  attachments.map((attachment, index) => (
    <FileRow key={index} disabled={isSubmitting}>
      <File
        key={index}
        status={checkAttachmentsError(errors, index) ? 'error' : 'uploaded'}
        onClickDownload={() => handleClickDownloadFile(attachment)}
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

const SecureMessageFormComponent = ({ onSubmit, notification, isOnline }) => {
  const { isMobile } = useMedia();
  const [isCustomPassword, setCustomPassword] = useState(false);

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
  } = useFormik({
    initialValues,
    onSubmit,
    validationSchema: schema,
  });

  const dirty = values.text || values.attachments.length;

  const handleChangeCustomPassword = () => {
    setCustomPassword(!isCustomPassword);

    if (isCustomPassword) {
      setFieldValue('password', '');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        {isMobile ? (
          <TextAreaStyled
            placeholder="Text or attachments to encrypt and expire"
            name="text"
            value={values.text}
            onBlur={handleBlur}
            onChange={handleChange}
            error={checkError(touched, errors, 'text')}
            disabled={isSubmitting}
          />
        ) : (
          <>
            <Label>Text or attachments to encrypt and expire</Label>
            <TextAreaStyled
              placeholder="Divide et Impera"
              name="text"
              value={values.text}
              onBlur={handleBlur}
              onChange={handleChange}
              error={checkError(touched, errors, 'text')}
              disabled={isSubmitting}
            />
          </>
        )}
      </Row>
      <AttachmentsSection>
        <StyledUploader
          multiple
          asPreview
          name="attachments"
          files={values.attachments}
          error={
            typeof errors?.attachments === 'string' ? errors.attachments : ''
          }
          notification={notification}
          onChange={setFieldValue}
          disabled={isSubmitting}
        />
        <Attachments>
          {renderAttachments(
            values.attachments,
            errors.attachments,
            setFieldValue,
            isSubmitting,
          )}
        </Attachments>
      </AttachmentsSection>
      <SelectRow>
        <Column>
          <Label>Data expires in</Label>
          <StyledSelect
            boxOffset={39}
            name="secondsLimit"
            placeholder="Select option"
            value={values.secondsLimit}
            options={secondsLimitOptions}
            onChange={setFieldValue}
            disabled={isSubmitting}
          />
        </Column>
        <ColumnStyled>
          <Label>{isMobile ? 'Attempts' : 'Number of Attempts'}</Label>
          <StyledSelect
            boxOffset={39}
            name="requestsLimit"
            placeholder="Select option"
            value={values.requestsLimit}
            options={requestsLimitOptions}
            onChange={setFieldValue}
            disabled={isSubmitting}
          />
        </ColumnStyled>
      </SelectRow>
      {!isMobile && (
        <Row>
          <Checkbox
            checked={isCustomPassword}
            value={isCustomPassword}
            onChange={handleChangeCustomPassword}
            isDisabled={isSubmitting}
          >
            Create my own password for access to encrypted data
          </Checkbox>
        </Row>
      )}
      {isCustomPassword && (
        <Row>
          <Label>Password</Label>
          <InputStyled
            name="password"
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {checkError(touched, errors, 'password') && (
            <Error>{checkError(touched, errors, 'password')}</Error>
          )}
        </Row>
      )}
      {errors?.form && (
        <>
          <Error>Oops… Something went wrong</Error>
          <Error>Please, click again on Create secure message</Error>
        </>
      )}
      <ButtonWrapper>
        <Hint text={!dirty ? 'Please, add text or attachments' : ''}>
          <StyledButton
            htmlType="submit"
            disabled={
              isSubmitting || (!isValid && !errors?.form) || !dirty || !isOnline
            }
          >
            Create Secure Message
          </StyledButton>
        </Hint>
      </ButtonWrapper>
    </Form>
  );
};

export const SecureMessageForm = withOfflineDetection(
  withNotification(SecureMessageFormComponent),
);
