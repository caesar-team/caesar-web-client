import React, { useState } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { media } from '@caesar/assets/styles/media';
import {
  Checkbox,
  TextArea,
  PasswordInput,
  File,
  Button,
  withNotification,
  withOfflineDetection,
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
  z-index: 1;
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

const FileRow = styled.div``;

const SelectRow = styled.div`
  position: relative;
  z-index: 2;
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
  position: relative;
  margin: 40px 0;

  ${media.desktop`
    margin: 24px 0;
  `}

  ${media.wideMobile`
    margin: 16px 0;
  `}
`;

const StyledButton = styled(Button)`
  position: relative;

  ${media.mobile`
    width: 100%;
  `}
`;

const ButtonImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 279px;
  height: 200px;
  transform: translate(-110px, -70px);
`;

const handleClickDownloadFile = attachment => {
  const { raw, name } = attachment;

  downloadFile(raw, name);
};

const checkAttachmentsError = (errors, index) =>
  errors[index] && errors[index].raw;

const renderAttachments = (attachments = [], errors = [], setFieldValue) =>
  attachments.map((attachment, index) => (
    <FileRow key={index}>
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

const SecureMessageForm = ({ onSubmit, notification, isOnline }) => {
  const { isMobile } = useMedia();
  const [isCustomPassword, setIsCustomPassword] = useState(false);

  const handleChange = () => {
    setIsCustomPassword(!isCustomPassword);
  };

  return (
    <Formik
      key="secureMessageForm"
      initialValues={initialValues}
      onSubmit={onSubmit}
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
        dirty,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Row>
            {isMobile ? (
              <FastField name="text">
                {({ field }) => (
                  <TextAreaStyled
                    {...field}
                    placeholder="Text or image to encrypt and expire"
                    onBlur={setFieldTouched}
                    error={checkError(touched, errors, 'text')}
                  />
                )}
              </FastField>
            ) : (
              <>
                <Label>Text or image to encrypt and expire</Label>
                <FastField name="text">
                  {({ field }) => (
                    <TextAreaStyled
                      {...field}
                      placeholder="Divide et Impera"
                      onBlur={setFieldTouched}
                      error={checkError(touched, errors, 'text')}
                    />
                  )}
                </FastField>
              </>
            )}
          </Row>
          <AttachmentsSection>
            <StyledUploader
              multiple
              asPreview
              name="attachments"
              files={values.attachments}
              notification={notification}
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
              />
            </ColumnStyled>
          </SelectRow>
          {!isMobile && (
            <Row>
              <Checkbox
                checked={isCustomPassword}
                value={isCustomPassword}
                onChange={handleChange}
              >
                Create my own password for access to encrypted data
              </Checkbox>
            </Row>
          )}
          {isCustomPassword && (
            <Row>
              <Label>Password</Label>
              <FastField name="password">
                {({ field }) => (
                  <InputStyled {...field} onBlur={setFieldTouched} />
                )}
              </FastField>
              {checkError(touched, errors, 'password') && (
                <Error>{checkError(touched, errors, 'password')}</Error>
              )}
            </Row>
          )}
          <ButtonWrapper>
            <ButtonImg
              srcSet="/images/secure-bg-btn@2x.png 2x, /images/secure-bg-btn@3x.png 3x"
              src="/images/secure-bg-btn.png"
            />
            <StyledButton
              htmlType="submit"
              disabled={isSubmitting || !(isValid && dirty) || !isOnline}
            >
              Create Secure Message
            </StyledButton>
          </ButtonWrapper>
        </Form>
      )}
    </Formik>
  );
};

export default withOfflineDetection(withNotification(SecureMessageForm));
