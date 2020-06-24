import React from 'react';
import { useFormik } from 'formik';
import { LockInput } from '@caesar/components';
import { decryptByPassword } from '@caesar/common/utils/cipherUtils';
import { schema } from '../schema';

export const PasswordStep = ({ message, password, setDecryptedMessage }) => {
  const handleSubmitPassword = async (
    { messagePassword },
    { setSubmitting, setErrors },
  ) => {
    try {
      const decryptedMessage = await decryptByPassword(
        message,
        messagePassword,
      );
      setDecryptedMessage(decryptedMessage);
      setSubmitting(false);
    } catch (error) {
      console.log('error: ', error);
      setErrors({
        password: 'Sorry, but the password is wrong :(',
      });
      setSubmitting(false);
    }
  };

  const {
    errors,
    values,
    handleChange,
    handleSubmit,
    submitForm,
    resetForm,
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
        onChange={handleChange}
        onClick={submitForm}
        onBackspace={resetForm}
        isError={Object.keys(errors).length !== 0}
      />
    </form>
  );
};
