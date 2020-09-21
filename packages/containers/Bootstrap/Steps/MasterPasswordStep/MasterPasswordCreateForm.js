import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import zxcvbn from 'zxcvbn';
import { checkError } from '@caesar/common/utils/formikUtils';
import {
  Head,
  AuthTitle,
  AuthDescription,
  MasterPasswordInput,
  Button,
  PasswordIndicator,
  TooltipPasswordGenerator,
  Tooltip,
  StrengthIndicator,
} from '@caesar/components';
import { GOOD_PASSWORD_RULES } from '@caesar/common/validation/constants';
import { INDICATOR_TYPE } from '@caesar/components/PasswordIndicator';
import { passwordSchema } from './schema';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TipText = styled.div`
  font-size: ${({ theme }) => theme.font.size.small};
  line-height: 1.5;
  text-align: center;
  margin-top: 30px;
`;

const PasswordIndicatorStyled = styled(PasswordIndicator)`
  justify-content: space-between;
  margin-top: 30px;

  ${PasswordIndicator.ScoreName} {
    width: 80px;
    margin-left: 16px;
    text-align: right;
  }
`;

const StrengthIndicatorStyled = styled(StrengthIndicator)`
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
  padding: 15px;

  ${StrengthIndicator.Text} {
    margin-bottom: 15px;
  }

  ${StrengthIndicator.HelperText} {
    font-size: 14px;
    color: ${({ theme }) => theme.color.gray};
    margin-bottom: 8px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
  margin-top: 45px;
`;

const StyledTooltipPasswordGenerator = styled(TooltipPasswordGenerator)`
  position: absolute;
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
`;

class MasterPasswordCreateForm extends PureComponent {
  handleGeneratePassword = setFieldValue => password =>
    setFieldValue('password', password);

  render() {
    const { initialValues, onSubmit } = this.props;

    return (
      <Formik
        key="password"
        initialValues={initialValues}
        isInitialValid={passwordSchema.isValidSync(initialValues)}
        validationSchema={passwordSchema}
        onSubmit={onSubmit}
      >
        {({
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          isValid,
          dirty,
          values,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Head title="Create master password for Caesar" />
            <AuthTitle>Master Password</AuthTitle>
            <AuthDescription>Create master password for Caesar</AuthDescription>
            <FieldWrapper>
              <FastField name="password">
                {({ field }) => (
                  <MasterPasswordInput
                    {...field}
                    isAlwaysVisibleIcon
                    placeholder="Type password…"
                    autoFocus
                    error={
                      dirty ? checkError(touched, errors, 'password') : null
                    }
                  />
                )}
              </FastField>
              <Tooltip
                show={values.password && !isValid}
                textBoxWidth="280px"
                arrowAlign="top"
                position="right center"
              >
                <StrengthIndicatorStyled
                  text="Our recommendations for creating a good master password:"
                  value={values.password}
                  rules={GOOD_PASSWORD_RULES}
                />
              </Tooltip>
              <StyledTooltipPasswordGenerator
                onGeneratePassword={this.handleGeneratePassword(setFieldValue)}
              />
            </FieldWrapper>
            {values.password && (
              <PasswordIndicatorStyled
                type={INDICATOR_TYPE.LINE}
                score={zxcvbn(values.password).score}
              />
            )}
            <TipText>
              Please, copy & save the master password in a safe place. Relogin
              will not be possible without this password.
            </TipText>
            <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
              Copy Password & Continue
            </StyledButton>
          </Form>
        )}
      </Formik>
    );
  }
}

export default MasterPasswordCreateForm;
