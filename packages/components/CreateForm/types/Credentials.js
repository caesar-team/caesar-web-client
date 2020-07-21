import React from 'react';
import { checkError } from '@caesar/common/utils/formikUtils';
import {
  Title,
  Input,
  Password,
  TextArea,
  Attachments,
} from '../../ItemFields/create';
import { Row } from '../../ItemFields/common';

export const Credentials = ({ formik }) => {
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
      <Row marginBottom={32}>
        <Input
          name="login"
          label="Login"
          autoComplete="new-username"
          value={values.login}
          error={checkError(touched, errors, 'login')}
          onChange={handleChange}
          onBlur={handleBlur}
          withBorder
          disabled={isSubmitting}
        />
      </Row>
      <Row marginBottom={32}>
        <Password
          name="pass"
          label="Password"
          autoComplete="new-password"
          value={values.pass}
          error={checkError(touched, errors, 'pass')}
          onChange={handleChange}
          onBlur={handleBlur}
          withBorder
          disabled={isSubmitting}
        />
      </Row>
      <Row marginBottom={32}>
        <Input
          name="website"
          label="Website"
          value={values.website}
          error={checkError(touched, errors, 'website')}
          onChange={handleChange}
          onBlur={handleBlur}
          withBorder
          disabled={isSubmitting}
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
