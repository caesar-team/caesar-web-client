import React from 'react';
import {
  Title,
  Input,
  Password,
  TextArea,
  Attachments,
} from '../../ItemFields/create';
import { Row } from '../../ItemFields/common';

export const Credentials = ({ formik }) => {
  const { values, errors, setFieldValue, handleChange, handleBlur } = formik;

  return (
    <>
      <Row marginBottom={40}>
        <Title
          name="name"
          placeholder="Enter the title"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Row>
      <Row marginBottom={32}>
        <Input
          name="login"
          label="Login"
          value={values.login}
          onChange={handleChange}
          onBlur={handleBlur}
          withBorder
        />
      </Row>
      <Row marginBottom={32}>
        <Password
          name="pass"
          label="Password"
          value={values.pass}
          onChange={handleChange}
          onBlur={handleBlur}
          withBorder
        />
      </Row>
      <Row marginBottom={32}>
        <Input
          name="website"
          label="Website"
          value={values.website}
          onChange={handleChange}
          onBlur={handleBlur}
          withBorder
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
