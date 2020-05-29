import React from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { Modal, FormInput, Button, Label } from '@caesar/components';
import { checkError } from '@caesar/common/utils/formikUtils';
import { renderTeamAvatars } from './renderTeamAvatars';
import { schema } from './schema';

const FormTitle = styled.div`
  padding-bottom: 25px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.black};
  text-transform: uppercase;
`;

const GroupAvatarsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const GroupAvatarsTitle = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.emperor};
`;

const GroupAvatarsTip = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
`;

const ButtonWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
`;

const initialValues = { title: '', icon: undefined };

const NewTeamModal = ({ onSubmit, onCancel = Function.prototype }) => {
  const {
    dirty,
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: ({ title, icon }) => {
      onSubmit({ title, icon: icon.raw });
    },
    validationSchema: schema,
  });

  return (
    <Modal
      isOpen
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      width="560"
      onRequestClose={onCancel}
    >
      <FormTitle>Add Team</FormTitle>
      <form onSubmit={handleSubmit}>
        <Label>Group name</Label>
        <FormInput
          name="title"
          values={values.title}
          autoFocus
          withBorder
          error={checkError(touched, errors, 'title')}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <GroupAvatarsWrapper>
          <GroupAvatarsTitle>Group avatar</GroupAvatarsTitle>
          <GroupAvatarsTip>
            Choose an avatar or upload (160x160 pixels, not more than 8 MB)
          </GroupAvatarsTip>
          {renderTeamAvatars(values, setFieldValue)}
        </GroupAvatarsWrapper>
        <ButtonWrapper>
          <Button
            disabled={!dirty || isSubmitting || !isValid}
            color="black"
            onClick={handleSubmit}
          >
            Create
          </Button>
        </ButtonWrapper>
      </form>
    </Modal>
  );
};

export default NewTeamModal;
