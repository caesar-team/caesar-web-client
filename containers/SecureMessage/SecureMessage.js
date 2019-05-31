import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Icon,
  LockInput,
  File,
  Button,
  Scrollbar,
  withNotification,
} from 'components';
import { FastField, Formik } from 'formik';
import { decryptByPassword } from 'common/utils/cipherUtils';
import { downloadAsZip, downloadFile } from 'common/utils/file';
import { copyToClipboard } from 'common/utils/clipboard';
import { schema } from './schema';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.emperor};
`;

const Title = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.lightGray};
  margin-bottom: 30px;
  margin-top: 60px;
`;

const StyledLogo = styled(Icon)`
  fill: ${({ theme }) => theme.white};
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.darkGray};
  padding: 0 20px;
  max-width: 620px;
  width: 100%;
`;

const Message = styled.div`
  color: ${({ theme }) => theme.white};
  padding: 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.emperor};
  max-height: 400px;
  height: 100%;
  user-select: none;
`;

const Attachments = styled.div`
  padding: 20px 0;
  max-height: 400px;
  height: 100%;
`;

const FileStyled = styled(File)`
  ${File.FileName} {
    color: ${({ theme }) => theme.white};

    &:hover {
      color: ${({ theme }) => theme.white};
    }
  }

  ${File.FileExt} {
    margin-bottom: 0;

    &:before {
      border-color: ${({ theme }) =>
        `${theme.darkGray} ${theme.darkGray} transparent transparent`};
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
      console.log(error);
      setErrors({
        password: 'Wrong password',
      });
    } finally {
      setSubmitting(false);
    }
  };

  handleClickCopyText = () => {
    const { notification } = this.props;
    const { decryptedMessage } = this.state;

    copyToClipboard(decryptedMessage.text);

    notification.show({
      text: `Text has copied.`,
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
        render={({ errors, handleSubmit, submitForm, resetForm }) => (
          <form onSubmit={handleSubmit}>
            <FastField
              name="password"
              render={({ field }) => (
                <LockInput
                  {...field}
                  autoFocus
                  onClick={submitForm}
                  onBackspace={resetForm}
                  isError={Object.keys(errors).length !== 0}
                />
              )}
            />
          </form>
        )}
      />
    );
  }

  renderMessageStep() {
    const { decryptedMessage } = this.state;

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
        <Message>
          <Scrollbar autoHeight>{decryptedMessage.text}</Scrollbar>
        </Message>
        {shouldShowAttachments && (
          <Attachments>
            <Scrollbar autoHeight>{renderedAttachments}</Scrollbar>
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

    return (
      <Wrapper>
        <StyledLogo name="logo-secure-message" width={214} height={60} />
        <Title>{title}</Title>
        {renderedStep}
        {shouldShowButtons && (
          <ButtonsWrapper>
            <Button
              color="white"
              icon="copy"
              onClick={this.handleClickCopyText}
            >
              Copy text
            </Button>
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
