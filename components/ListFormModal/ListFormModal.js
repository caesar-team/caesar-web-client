import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal, Input, Form, Button } from 'antd';
import {
  LIST_WORKFLOW_CREATE_MODE,
  POST_WORKFLOW_EDIT_MODE,
} from 'common/constants';

const { Item } = Form;

const FormItem = styled(Item)`
  padding-bottom: 0;
  margin-bottom: 0;
`;

const hasFieldsErrors = fieldsError =>
  Object.keys(fieldsError).some(field => fieldsError[field]);

const hasFormErrors = (mode, getFieldsError, isFieldTouched) => {
  if (mode === POST_WORKFLOW_EDIT_MODE) {
    return hasFieldsErrors(getFieldsError(['label']));
  }

  return hasFieldsErrors(getFieldsError(['label'])) || !isFieldTouched('label');
};

class ListFormModal extends Component {
  handleSubmit = event => {
    event.preventDefault();

    const {
      onCreate = Function.prototype,
      onUpdate = Function.prototype,
      list: { mode },
    } = this.props;

    this.props.form.validateFields((error, values) => {
      if (!error) {
        const action = mode === LIST_WORKFLOW_CREATE_MODE ? onCreate : onUpdate;

        action(values);
      }
    });
  };

  render() {
    const { list, form, onCancel = Function.prototype } = this.props;

    const { label, mode } = list;
    const { getFieldDecorator, isFieldTouched, getFieldsError } = form;

    const isButtonDisabled = hasFormErrors(
      mode,
      getFieldsError,
      isFieldTouched,
    );

    return (
      <Modal
        visible
        centered
        title="New list"
        footer={[
          <Button key="1" onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            key="2"
            type="primary"
            disabled={isButtonDisabled}
            onClick={this.handleSubmit}
          >
            {mode === LIST_WORKFLOW_CREATE_MODE ? 'Create' : 'Update'}
          </Button>,
        ]}
        onCancel={onCancel}
      >
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('label', {
              rules: [
                {
                  required: true,
                  message: 'Please input the list name',
                },
              ],
              initialValue: label,
            })(<Input placeholder="Enter new list name..." size="large" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ListFormModal);
