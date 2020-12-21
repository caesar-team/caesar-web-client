import React from 'react';
import { checkError } from '@caesar/common/utils/formikUtils';
import { Title, TextArea, Attachments } from '../../ItemFields/create';
import { Row } from '../../ItemFields/common';

export const Document = ({ formik }) => {
  const {
    touched,
    values,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
    isSubmitting,
  } = formik;

  return (
    <>
      <Row marginBottom={40}>
        <Title
          autoFocus
          name="name"
          placeholder="Enter the title"
          value={values.name}
          error={checkError(touched, errors, 'name')}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </Row>
      <Row marginBottom={24}>
        <TextArea
          name="note"
          label="Notes"
          placeholder="Write here something…"
          value={values.note}
          error={checkError(touched, errors, 'note')}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
      </Row>
      <Row>
        <Attachments
          name="attachments"
          value={values.attachments}
          error={errors.attachments}
          setFieldValue={setFieldValue}
          disabled={isSubmitting}
        />
      </Row>
    </>
  );
};
