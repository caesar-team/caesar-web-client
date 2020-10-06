import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { createItemRequest } from '@caesar/common/actions/entities/item';
import { processUploadedFiles } from '@caesar/common/utils/attachment';
import { userIdSelector } from '@caesar/common/selectors/user';
import { FormByType, FormHeader, FormFooter } from './components';
import { getInitialValues, getValidationSchema } from './utils';

const Form = styled.form`
  padding: 8px 0 88px;
`;

const StyledFormHeader = styled(FormHeader)`
  margin-bottom: 24px;
`;

export const CreateForm = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  const handleCreate = (
    {
      name = null,
      note = null,
      pass = null,
      website = null,
      login = null,
      attachments: uploadedFiles = null,
      ...itemForm
    },
    { setSubmitting },
  ) => {
    const { attachments = [], raws = {} } = processUploadedFiles(uploadedFiles);
    const data = {
      name,
      note,
      pass,
      website,
      login,
      attachments,
      raws,
    };

    dispatch(
      createItemRequest(
        {
          ...itemForm,
          data,
        },
        setSubmitting,
      ),
    );
  };

  const formik = useFormik({
    initialValues: getInitialValues(query.type, query.teamId, query.listId),
    validationSchema: getValidationSchema(query.type),
    onSubmit: handleCreate,
  });
  const { values, setFieldValue, handleSubmit } = formik;

  const handleChangePath = (teamId, listId) => {
    if (teamId !== values.teamId) {
      setFieldValue('teamId', teamId);
    }

    if (listId !== values.listId) {
      setFieldValue('listId', listId);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <StyledFormHeader
        teamId={query.teamId}
        listId={query.listId}
        onChangePath={handleChangePath}
      />
      <FormByType type={query.type} formik={formik} />
      <FormFooter formik={formik} />
    </Form>
  );
};
