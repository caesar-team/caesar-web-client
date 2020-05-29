import React from 'react';
import { useFormik } from 'formik';
import { LockInput } from '@caesar/components';
import { decryptByPassword } from '@caesar/common/utils/cipherUtils';
import { schema } from '../schema';

export const PasswordStep = ({ message, setDecryptedMessage }) => {
  const handleSubmitPassword = async (
    { password },
    { setSubmitting, setErrors },
  ) => {
    try {
      const decryptedMessage = await decryptByPassword(message, password);
      setDecryptedMessage(decryptedMessage);
    } catch (error) {
      console.log('error: ', error);
      setErrors({
        password: 'Sorry, but the password is wrong :(',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const { errors, values, handleSubmit, submitForm, resetForm } = useFormik({
    initialValues: { password: '' },
    validationSchema: schema,
    onSubmit: handleSubmitPassword,
    validateOnChange: false,
  });

  return (
    <form onSubmit={handleSubmit}>
      <LockInput
        autoFocus
        name="password"
        value={values.password}
        onClick={submitForm}
        onBackspace={resetForm}
        isError={Object.keys(errors).length !== 0}
      />
    </form>
  );
};
