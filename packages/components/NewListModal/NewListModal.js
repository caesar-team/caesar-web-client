import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { Modal, FormInput, Button, Label } from '@caesar/components';
import { checkError } from '@caesar/common/utils/formikUtils';
import { LIST_MODE } from '@caesar/common/constants';
import { schema } from './schema';

const FormTitle = styled.div`
  padding-bottom: 25px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.black};
  text-transform: uppercase;
`;

const ButtonWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
`;

class NewListModal extends Component {
  createInitialValue = list => ({ label: list ? list.label : '' });

  render() {
    const {
      list,
      mode,
      onCancel = Function.prototype,
      onSubmit = Function.prototype,
    } = this.props;

    const isCreateMode = mode === LIST_MODE.WORKFLOW_CREATE;

    return (
      <Modal
        isOpen
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        width="560"
        onRequestClose={onCancel}
      >
        <FormTitle>{isCreateMode ? 'Add list' : 'Edit list'}</FormTitle>
        <Formik
          key="editListForm"
          initialValues={this.createInitialValue(list)}
          onSubmit={onSubmit}
          isInitialValid={schema.isValidSync(this.createInitialValue(list))}
          validationSchema={schema}
        >
          {({ errors, touched, handleSubmit, isSubmitting, isValid }) => (
            <form onSubmit={handleSubmit}>
              <Label>Name</Label>
              <FastField name="label">
                {({ field }) => (
                  <FormInput
                    autoFocus
                    withBorder
                    {...field}
                    error={checkError(touched, errors, 'label')}
                  />
                )}
              </FastField>
              <ButtonWrapper>
                <Button
                  disabled={isSubmitting || !isValid}
                  color="black"
                  onClick={handleSubmit}
                >
                  {isCreateMode ? 'CREATE' : 'UPDATE'}
                </Button>
              </ButtonWrapper>
            </form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default NewListModal;
