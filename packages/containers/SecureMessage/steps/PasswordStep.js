import React from 'react';
import { useFormik } from 'formik';
import { LockInput } from '@caesar/components';
import {
  decryptSecretMessage,
  decryptSecretRaws,
} from '@caesar/common/utils/secret';

import { logger } from '@caesar/common/utils/logger';
import { schema } from '../schema';

export const PasswordStep = ({
  message,
  password,
  setDecryptedMessage,
  setDecryptedRaws,
}) => {
  const handleSubmitPassword = async (
    { messagePassword },
    { setSubmitting, setErrors },
  ) => {
    try {
      setSubmitting(false);
      setDecryptedMessage(await decryptSecretMessage(message, messagePassword));
      setDecryptedRaws(await decryptSecretRaws(message, messagePassword));
    } catch (error) {
      logger.error('error: ', error);
      setSubmitting(false);
      setErrors({
        password: 'Sorry, but the password is wrong :(',
      });
    }
  };

  const {
    errors,
    values,
    handleChange,
    handleSubmit,
    submitForm,
    setErrors,
  } = useFormik({
    initialValues: { messagePassword: password },
    validationSchema: schema,
    onSubmit: handleSubmitPassword,
    validateOnChange: false,
  });

  return (
    <form onSubmit={handleSubmit}>
      <LockInput
        autoFocus
        name="messagePassword"
        value={values.messagePassword}
        onChange={e => {
          if (Object.keys(errors).length) setErrors({});
          handleChange(e);
        }}
        onClick={submitForm}
        isError={Object.keys(errors).length !== 0}
      />
    </form>
  );
};
