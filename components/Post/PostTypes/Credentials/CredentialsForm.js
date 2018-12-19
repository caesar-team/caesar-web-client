import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Form, Input, Select, Upload, message } from 'antd';
import { PasswordInput } from 'components/Input';
import { Icon } from 'components/Icon';
import InboxIcon from 'static/images/svg/icon-inbox.svg';
import {
  MAX_UPLOADING_FILE_SIZE,
  TRASH_TYPE,
  POST_WORKFLOW_CREATE_MODE,
  POST_WORKFLOW_EDIT_MODE,
} from 'common/constants';
import { rules } from './constants';

const { Item } = Form;
const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;

const StyledForm = styled(Form)`
  margin-bottom: 40px;
`;

const FormItem = styled(Item)`
  .ant-form-item-label {
    text-align: left;
  }

  .ant-form-item-control {
    line-height: normal;
  }

  label {
    font-size: 18px;
    color: #888b90;

    &:after {
      content: none;
    }
  }

  .ant-form-item-required:before {
    display: none;
  }
`;

const NameTextArea = styled(TextArea)`
  border: none;
  resize: none;
  padding: 0;
  font-size: 24px;
  color: #2e2f31;

  &:hover,
  &:focus {
    border: none;
    border-color: initial !important;
    outline: 0;
    box-shadow: none !important;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 16px auto 32px;
`;

const StyledButton = styled(Button)`
  margin-left: 20px;
`;

const Uploader = styled(Dragger)`
  .ant-upload.ant-upload-drag {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100px;
  }

  .ant-upload-list-item {
    font-size: 18px;
  }
`;

const StyledTextArea = styled(TextArea)`
  padding: 8px 12px;
  font-size: 18px;
  color: #2e2f31;
`;

const StyledUploadIcon = styled(Icon)`
  margin-top: 24px;

  > svg {
    width: 48px;
    height: 48px;
    fill: #3d70ff;
  }
`;

const UploaderText = styled.div`
  font-size: 18px;
  line-height: 24px;
  margin-top: 20px;
`;

const UploaderFileExt = styled.div`
  font-size: 18px;
  color: #888b90;
  margin-bottom: 24px;
`;

const UploadWord = styled.a`
  color: #3d70ff;
`;

const RemoveButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const MAX_FILE_SIZE_MB = Number(MAX_UPLOADING_FILE_SIZE) / 1024 / 1024;

const ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const hasFieldsErrors = fieldsError =>
  Object.keys(fieldsError).some(field => fieldsError[field]);

const hasFormErrors = (mode, getFieldsError, isFieldTouched) => {
  if (mode === POST_WORKFLOW_EDIT_MODE) {
    return hasFieldsErrors(
      getFieldsError(['name', 'login', 'pass', 'website']),
    );
  }

  return (
    hasFieldsErrors(getFieldsError(['name', 'login', 'pass', 'website'])) ||
    !isFieldTouched('name') ||
    !isFieldTouched('login') ||
    !isFieldTouched('pass')
  );
};

const renderOptions = list =>
  list.filter(({ type }) => type !== TRASH_TYPE).map(({ id, label }) => (
    <Option key={id} value={id}>
      {label}
    </Option>
  ));

class CredentialsForm extends Component {
  state = this.prepareInitialState();

  handleSubmit = event => {
    event.preventDefault();

    const { files } = this.state;

    const {
      form,
      mode,
      onFinishCreateWorkflow,
      onFinishEditWorkflow,
    } = this.props;

    form.validateFields((error, values) => {
      if (!error) {
        const action =
          mode === POST_WORKFLOW_EDIT_MODE
            ? onFinishEditWorkflow
            : onFinishCreateWorkflow;
        action({ ...values, attachments: files });
      }
    });
  };

  // prevent sending on backend by default and check size
  handleBeforeUpload = file => {
    const fileSizeMB = file.size / 1024 / 1024;

    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      message.error(
        `File «${file.name}» must be smaller than ${MAX_FILE_SIZE_MB}MB!`,
      );
      return false;
    }

    this.setState(prevState => ({
      files: [...prevState.files, file],
    }));

    return false;
  };

  // ugly hack for special case: post has edit mode and you want to delete
  // a file. Without that it will be crashed
  normalizeFile = ({ fileList }) => fileList;

  prepareInitialState() {
    const {
      post: {
        secret: { attachments },
      },
    } = this.props;

    return {
      files: attachments,
    };
  }

  render() {
    const { files } = this.state;
    const {
      allLists,
      mode,
      onCancelWorkflow,
      onClickMoveToTrash,
      form,
      post,
    } = this.props;

    const {
      secret: { name, login, pass, website, note },
      listId,
    } = post;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = form;

    const shouldShowRemoveButton = mode === POST_WORKFLOW_EDIT_MODE;
    const nameError = isFieldTouched('name') && getFieldError('name');
    const loginError = isFieldTouched('login') && getFieldError('login');
    const passwordError = isFieldTouched('pass') && getFieldError('pass');
    const websiteError = getFieldError('website');

    const submitIsDisabled = hasFormErrors(
      mode,
      getFieldsError,
      isFieldTouched,
    );

    return (
      <StyledForm onSubmit={this.handleSubmit}>
        <FormItem validateStatus={nameError ? 'error' : ''}>
          {getFieldDecorator('name', {
            rules: rules.name,
            initialValue: name,
          })(
            <NameTextArea
              autoFocus
              autosize
              name="name"
              placeholder="Enter your title…"
              size="large"
            />,
          )}
        </FormItem>
        <ButtonsWrapper>
          <Button size="large" onClick={onCancelWorkflow}>
            Cancel
          </Button>
          <StyledButton
            type="primary"
            size="large"
            htmlType="submit"
            disabled={submitIsDisabled}
          >
            {mode === POST_WORKFLOW_CREATE_MODE ? 'Add' : 'Update'}
          </StyledButton>
        </ButtonsWrapper>
        <FormItem
          label="Login"
          validateStatus={loginError ? 'error' : ''}
          {...ITEM_LAYOUT}
        >
          {getFieldDecorator('login', {
            rules: rules.login,
            initialValue: login,
          })(
            <Input name="login" placeholder="Enter your login…" size="large" />,
          )}
        </FormItem>
        <FormItem
          label="Password"
          validateStatus={passwordError ? 'error' : ''}
          {...ITEM_LAYOUT}
        >
          {getFieldDecorator('pass', {
            rules: rules.pass,
            initialValue: pass,
          })(
            <PasswordInput
              name="pass"
              placeholder="Enter password…"
              size="large"
            />,
          )}
        </FormItem>
        <FormItem
          label="Website"
          validateStatus={websiteError ? 'error' : ''}
          {...ITEM_LAYOUT}
        >
          {getFieldDecorator('website', {
            rules: rules.website,
            initialValue: website,
          })(<Input name="website" placeholder="..." size="large" />)}
        </FormItem>
        <FormItem label="List" {...ITEM_LAYOUT}>
          {getFieldDecorator('listId', {
            initialValue: listId,
          })(
            <Select name="listId" placeholder="Select list" size="large">
              {renderOptions(allLists)}
            </Select>,
          )}
        </FormItem>
        <FormItem label="Note">
          {getFieldDecorator('note', {
            initialValue: note,
          })(<StyledTextArea name="note" placeholder="Enter note…" rows={4} />)}
        </FormItem>
        <FormItem label="Attachments">
          {getFieldDecorator('attachments', {
            getValueFromEvent: this.normalizeFile,
          })(
            <Uploader
              multiple
              name="attachments"
              fileList={files}
              beforeUpload={this.handleBeforeUpload}
            >
              <StyledUploadIcon component={InboxIcon} />
              <UploaderText>
                Drag and drop your file here or <UploadWord>upload</UploadWord>.
              </UploaderText>
              <UploaderFileExt>
                .rar .zip .doc .docx .pdf .jpg...
              </UploaderFileExt>
            </Uploader>,
          )}
        </FormItem>
        {shouldShowRemoveButton && (
          <RemoveButtonWrapper>
            <Button
              type="danger"
              size="large"
              icon="delete"
              onClick={onClickMoveToTrash}
            >
              Remove
            </Button>
          </RemoveButtonWrapper>
        )}
      </StyledForm>
    );
  }
}

export default Form.create()(CredentialsForm);
