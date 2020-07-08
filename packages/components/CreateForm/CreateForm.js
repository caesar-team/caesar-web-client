import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { ITEM_TYPE } from '@caesar/common/constants';
import { TextError } from '../Error';
import { FormHeader, FormFooter } from './components';
import { Credentials, Document } from './types';

const Form = styled.form`
  padding: 8px 0 88px;
`;

const StyledFormHeader = styled(FormHeader)`
  margin-bottom: 24px;
`;

export const CreateForm = () => {
  const { query } = useRouter();

  const initialValues = {
    teamId: query.teamId,
    listId: query.listId,
    title: '',
    login: '',
    pass: '',
    website: '',
    note: '',
    attachments: [],
  };

  const handleCreate = (values, formikBag) => {
    console.log('handleSubmit', values);
  };

  // const handleClickCreateItem = (name, type) => {
  //   dispatch(resetWorkInProgressItemIds());
  //   dispatch(
  //     setWorkInProgressItem(
  //       initialItemData(type, workInProgressList.id),
  //       ITEM_MODE.WORKFLOW_CREATE,
  //     ),
  //   );
  // };

  const formik = useFormik({
    initialValues,
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

  const FormByType = props => {
    switch (props.type) {
      case ITEM_TYPE.CREDENTIALS:
        return <Credentials {...props} />;
      case ITEM_TYPE.DOCUMENT:
        return <Document {...props} />;
      default:
        return <TextError>Unknown type</TextError>;
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
      <FormFooter onSubmit={handleSubmit} />
    </Form>
  );
};
