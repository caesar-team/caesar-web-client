import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import {
  Checkbox,
  TextArea,
  Uploader,
  PasswordInput,
  File,
  Button,
  withNotification,
  withOfflineDetection,
} from 'components';
import { Select } from 'components/Select';
import { checkError } from 'common/utils/formikUtils';
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
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ColumnStyled = styled(Column)`
  margin-left: 20px;
`;

const Label = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
`;

const InputStyled = styled(PasswordInput)`
  border-radius: 3px;
  border: solid 1px ${({ theme }) => theme.gallery};
`;

const TextAreaStyled = styled(TextArea)`
  ${TextArea.TextAreaField} {
    background: ${({ theme }) => theme.white};
  }
`;

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.red};
`;

const AttachmentsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Attachments = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 20px 0;
`;

const SelectRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 30px;
  margin-top: 30px;
`;

const StyledSelect = styled(Select)`
  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.gallery};
  border-radius: 3px;
  padding: 18px 20px;
  height: 60px;

  ${Select.ValueText} {
    padding: 0;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.6px;
  }
`;

const ButtonWrapper = styled.div`
  margin: 30px 0;
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  letter-spacing: 0.6px;
  padding: 18px 30px;
  height: 60px;
`;

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

class SecureMessageForm extends Component {
  state = {
    isCustomPassword: false,
  };

  handleChange = () => {
    this.setState(prevState => ({
      isCustomPassword: !prevState.isCustomPassword,
    }));
  };

  render() {
    const { onSubmit, notification, isOnline } = this.props;
    const { isCustomPassword } = this.state;

    return (
      <Formik
        key="secureMessageForm"
        initialValues={initialValues}
        onSubmit={onSubmit}
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
            <Row>
              <Label>Text or image to encrypt and expire</Label>
              <FastField
                name="text"
                render={({ field }) => (
                  <TextAreaStyled
                    {...field}
                    placeholder="Divide et Impera"
                    onBlur={setFieldTouched}
                    error={checkError(touched, errors, 'text')}
                  />
                )}
              />
            </Row>
            <AttachmentsSection>
              <Uploader
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
                <Label>Number of Attempts</Label>
                <StyledSelect
                  boxOffset={60}
                  name="requestsLimit"
                  placeholder="Select option"
                  value={values.requestsLimit}
                  options={requestsLimitOptions}
                  onChange={setFieldValue}
                />
              </Column>
              <ColumnStyled>
                <Label>Data expires in</Label>
                <StyledSelect
                  boxOffset={60}
                  name="secondsLimit"
                  placeholder="Select option"
                  value={values.secondsLimit}
                  options={secondsLimitOptions}
                  onChange={setFieldValue}
                />
              </ColumnStyled>
            </SelectRow>
            <Row>
              <Checkbox
                checked={isCustomPassword}
                value={isCustomPassword}
                onChange={this.handleChange}
              >
                Create my own password for access to encrypted data
              </Checkbox>
            </Row>
            {isCustomPassword && (
              <Row>
                <Label>Password</Label>
                <FastField
                  name="password"
                  render={({ field }) => (
                    <InputStyled {...field} onBlur={setFieldTouched} />
                  )}
                />
                {checkError(touched, errors, 'password') && (
                  <Error>{checkError(touched, errors, 'password')}</Error>
                )}
              </Row>
            )}
            <ButtonWrapper>
              <StyledButton
                htmlType="submit"
                disabled={isSubmitting || !isValid || !isOnline}
              >
                Create Secure Message
              </StyledButton>
            </ButtonWrapper>
          </Form>
        )}
      />
    );
  }
}

export default withOfflineDetection(withNotification(SecureMessageForm));
