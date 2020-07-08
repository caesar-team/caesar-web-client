import React from 'react';
import { Title, TextArea, Attachments } from '../../ItemFields/create';
import { Row } from '../../ItemFields/common';

export const Document = ({ formik }) => {
  const { values, setFieldValue, handleChange, handleBlur } = formik;

  return (
    <>
      <Row marginBottom={40}>
        <Title
          name="title"
          placeholder="Enter the title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Row>
      <Row marginBottom={24}>
        <TextArea
          name="note"
          label="Notes"
          placeholder="Write here something…"
          value={values.note}
          onChange={handleChange}
          onBlur={handleBlur}
          withBorder
        />
      </Row>
      <Row>
        <Attachments
          value={values.attachments}
          //  error={errors.attachments}
          setFieldValue={setFieldValue}
        />
      </Row>
    </>
  );
};
