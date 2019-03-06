import React, { Component } from 'react';
import styled from 'styled-components';
import { AuthDescription, AuthTitle, Head } from 'components';
import { postChangePassword } from 'common/api';
import { createSrp } from 'common/utils/srp';
import PasswordForm from './PasswordForm';

const Wrapper = styled.div`
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
`;

const srp = createSrp();

class PasswordStep extends Component {
  handleSubmit = async ({ password }, { setSubmitting, setErrors }) => {
    const { email, onFinish } = this.props;

    if (!email) {
      throw new Error(`
        Password step: incorrect behaviour, because password step is available 
        only for read only accounts, but email is empty
      `);
    }

    const error = 'Something wrong, please try again';

    const seed = srp.getRandomSeed();
    const verifier = srp.generateV(srp.generateX(seed, email, password));

    try {
      await postChangePassword({ seed, verifier });

      // TODO: add request for changing require_password_refresh flag on BE

      onFinish();
    } catch (e) {
      setErrors({ password: error, confirmPassword: error });
      setSubmitting(false);
    }
  };

  render() {
    return (
      <Wrapper>
        <Head title="Enter password which you received" />
        <AuthTitle>Change Password</AuthTitle>
        <AuthDescription>Enter and confirm new password</AuthDescription>
        <PasswordForm onSubmit={this.handleSubmit} />
      </Wrapper>
    );
  }
}

export default PasswordStep;
