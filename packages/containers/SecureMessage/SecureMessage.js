import React, { Component } from 'react';
import styled from 'styled-components';
import copy from 'copy-text-to-clipboard';
import {
  Icon,
  LockInput,
  File,
  Button,
  Scrollbar,
  withNotification,
} from '@caesar/components';
import { FastField, Formik } from 'formik';
import { decryptByPassword } from '@caesar/common/utils/cipherUtils';
import { downloadAsZip, downloadFile } from '@caesar/common/utils/file';
import { schema } from './schema';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.emperor};
`;

const Title = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.lightGray};
  margin-bottom: 30px;
  margin-top: 60px;
`;

const StyledLogo = styled(Icon)`
  fill: ${({ theme }) => theme.color.white};
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 620px;
  padding: 0 24px;
  background: ${({ theme }) => theme.color.darkGray};
`;

const Message = styled.textarea`
  padding: 24px 0;
  width: 100%;
  height: 191px;
  resize: none;
  font-size: inherit;
  color: ${({ theme }) => theme.color.white};
  background: transparent;
  border: none;
  outline: none;
`;

const Attachments = styled.div``;

const FileStyled = styled(File)`
  ${File.FileName} {
    color: ${({ theme }) => theme.color.white};

    &:hover {
      color: ${({ theme }) => theme.color.white};
    }
  }

  ${File.FileExt} {
    margin-bottom: 0;

    &:before {
      border-color: ${({ theme }) =>
        `${theme.color.darkGray} ${theme.color.darkGray} transparent transparent`};
    }
  }

  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const ButtonStyled = styled(Button)`
  margin-left: 20px;
`;

class SecureMessageContainer extends Component {
  state = {
    decryptedMessage: null,
  };

  handleSubmitPassword = async ({ password }, { setSubmitting, setErrors }) => {
    try {
      const { message } = this.props;

      const decryptedMessage = await decryptByPassword(message, password);

      this.setState({
        decryptedMessage,
      });
    } catch (error) {
      setErrors({
        password: 'Sorry, but the password is wrong :(',
      });
    } finally {
      setSubmitting(false);
    }
  };

  handleClickCopyText = () => {
    const { notification } = this.props;
    const { decryptedMessage } = this.state;

    copy(decryptedMessage.text);

    notification.show({
      text: `The text has been copied.`,
    });
  };

  handleClickDownloadFile = index => () => {
    const { decryptedMessage } = this.state;
    const { raw, name } = decryptedMessage.attachments[index];

    downloadFile(raw, name);
  };

  handleClickDownloadFiles = () => {
    const { decryptedMessage } = this.state;

    downloadAsZip(decryptedMessage.attachments);
  };

  renderPasswordStep() {
    return (
      <Formik
        initialValues={{ password: '' }}
        validationSchema={schema}
        onSubmit={this.handleSubmitPassword}
        validateOnChange={false}
      >
        {({ errors, handleSubmit, submitForm, resetForm }) => (
          <form onSubmit={handleSubmit}>
            <FastField name="password">
              {({ field }) => (
                <LockInput
                  {...field}
                  autoFocus
                  onClick={submitForm}
                  onBackspace={resetForm}
                  isError={Object.keys(errors).length !== 0}
                />
              )}
            </FastField>
          </form>
        )}
      </Formik>
    );
  }

  renderMessageStep() {
    const { decryptedMessage } = this.state;

    const shouldShowText = !!decryptedMessage.text;
    const shouldShowAttachments = decryptedMessage.attachments.length > 0;

    const renderedAttachments = decryptedMessage.attachments.map(
      (attachment, index) => (
        <FileStyled
          key={index}
          onClickDownload={this.handleClickDownloadFile(index)}
          {...attachment}
        />
      ),
    );

    return (
      <MessageWrapper>
        {shouldShowText && (
          <Scrollbar autoHeight autoHeightMax={191}>
            <Message readOnly>{decryptedMessage.text}</Message>
          </Scrollbar>
        )}
        {shouldShowAttachments && (
          <Attachments>
            <Scrollbar autoHeight autoHeightMax={230}>
              {renderedAttachments}
            </Scrollbar>
          </Attachments>
        )}
      </MessageWrapper>
    );
  }

  render() {
    const { decryptedMessage } = this.state;

    const title = decryptedMessage
      ? 'It’s your secret'
      : 'Enter password to access';

    const renderedStep = decryptedMessage
      ? this.renderMessageStep()
      : this.renderPasswordStep();

    const shouldShowButtons = !!decryptedMessage;
    const shouldShowDownloadButton =
      decryptedMessage &&
      decryptedMessage.attachments &&
      decryptedMessage.attachments.length > 0;

    const shouldShowTextButton =
      decryptedMessage &&
      decryptedMessage.text &&
      decryptedMessage.text.length > 0;

    return (
      <Wrapper>
        <StyledLogo name="logo-secure-message" width={214} height={60} />
        <Title>{title}</Title>
        {renderedStep}
        {shouldShowButtons && (
          <ButtonsWrapper>
            {shouldShowTextButton && (
              <ButtonStyled
                color="white"
                icon="copy"
                onClick={this.handleClickCopyText}
              >
                Copy text
              </ButtonStyled>
            )}
            {shouldShowDownloadButton && (
              <ButtonStyled
                color="white"
                icon="download"
                onClick={this.handleClickDownloadFiles}
              >
                Download all files
              </ButtonStyled>
            )}
          </ButtonsWrapper>
        )}
      </Wrapper>
    );
  }
}

export default withNotification(SecureMessageContainer);
