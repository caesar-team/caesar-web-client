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
  Link,
  Button,
  PasswordIndicator,
  Icon,
  Tooltip,
  StrengthIndicator,
} from '@caesar/components';
import { passwordSchema } from './schema';
import { REGEXP_TEXT_MATCH } from '../../constants';
import { TooltipPasswordGenerator } from './components';

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
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.4px;
  text-align: center;
  margin-top: 20px;
`;

const PasswordIndicatorStyled = styled(PasswordIndicator)`
  margin-top: 20px;
`;

const StrengthIndicatorStyled = styled(StrengthIndicator)`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.color.gray};
  padding: 15px;

  ${StrengthIndicator.Text} {
    margin-bottom: 15px;
  }

  ${StrengthIndicator.HelperText} {
    font-size: 14px;
    letter-spacing: 0.4px;
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

const BottomWrapper = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.color.gray};
`;

const DiceIcon = styled(Icon)`
  cursor: pointer;
  position: absolute;
  right: 60px;
  top: 18px;
  height: 20px;
`;

class MasterPasswordCreateForm extends PureComponent {
  state = this.prepareInitialState();

  handleToggleVisibility = changedVisibility => () => {
    this.setState({
      isPasswordGeneratorTooltipVisible: changedVisibility,
    });
  };

  handleGeneratePassword = setFieldValue => password =>
    setFieldValue('password', password);

  prepareInitialState() {
    return {
      isPasswordGeneratorTooltipVisible: false,
    };
  }

  render() {
    const { initialValues, onSubmit } = this.props;
    const { isPasswordGeneratorTooltipVisible } = this.state;

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
                  rules={REGEXP_TEXT_MATCH}
                />
              </Tooltip>
              <DiceIcon
                name="dice"
                width={20}
                height={20}
                onClick={this.handleToggleVisibility(true)}
              />
              <TooltipPasswordGenerator
                isVisible={isPasswordGeneratorTooltipVisible}
                onToggleVisibility={this.handleToggleVisibility(
                  false,
                  setFieldValue,
                )}
                onGeneratePassword={this.handleGeneratePassword(setFieldValue)}
              />
            </FieldWrapper>
            {values.password && (
              <PasswordIndicatorStyled score={zxcvbn(values.password).score} />
            )}
            <TipText>
              Please copy & save the master password in a safe place. Relogin
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
