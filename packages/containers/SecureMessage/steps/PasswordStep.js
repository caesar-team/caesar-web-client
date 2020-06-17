import React from 'react';
import { useFormik } from 'formik';
import { LockInput } from '@caesar/components';
import { decryptByPassword } from '@caesar/common/utils/cipherUtils';
import { schema } from '../schema';

export const PasswordStep = ({ message, password, setDecryptedMessage }) => {
  const handleSubmitPassword = async (
    { passwordMessage },
    { setSubmitting, setErrors },
  ) => {
    try {
      const decryptedMessage = await decryptByPassword(
        message,
        passwordMessage,
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
    initialValues: { password },
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
        onChange={handleChange}
        onClick={submitForm}
        onBackspace={resetForm}
        isError={Object.keys(errors).length !== 0}
      />
    </form>
  );
};
