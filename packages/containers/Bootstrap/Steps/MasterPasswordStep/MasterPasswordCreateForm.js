import React, { memo } from 'react';
import { useEffectOnce } from 'react-use';
import { useFormik } from 'formik';
import zxcvbn from 'zxcvbn';
import copy from 'copy-text-to-clipboard';
import styled from 'styled-components';
import { useNotification } from '@caesar/common/hooks';
import { useMedia } from '@caesar/common/hooks';
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
import {
  GOOD_PASSWORD_RULES,
  MAX_PASSWORD_LENGTH,
} from '@caesar/common/validation/constants';
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
  margin-top: 45px;
`;

const StyledTooltipPasswordGenerator = styled(TooltipPasswordGenerator)`
  position: absolute;
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
`;

const MasterPasswordCreateFormComponent = ({ initialValues, onSubmit }) => {
  const notification = useNotification();
  const { isMobile, isWideMobile } = useMedia();
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    validateForm,
  } = useFormik({
    initialValues,
    validationSchema: passwordSchema,
    onSubmit,
  });
  useEffectOnce(() => {
    validateForm();
  });

  const handleGeneratePassword = setValue => password => {
    setValue('password', password);
    copy(password);
    notification.show({
      text: 'Master Password has been copied to clipboard!',
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Head title="Create master password for Caesar" />
      <AuthTitle>Master Password</AuthTitle>
      <AuthDescription isCompact={isMobile || isWideMobile}>
        Create master password for Caesar
      </AuthDescription>
      <FieldWrapper>
        <MasterPasswordInput
          name="password"
          value={values.password}
          placeholder="Type password…"
          isAlwaysVisibleIcon
          autoFocus
          maxLength={MAX_PASSWORD_LENGTH}
          error={dirty ? checkError(touched, errors, 'password') : null}
          onChange={handleChange}
          onBlur={handleBlur}
        />
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
          onGeneratePassword={handleGeneratePassword(setFieldValue)}
        />
      </FieldWrapper>
      {values.password && (
        <PasswordIndicatorStyled
          type={INDICATOR_TYPE.LINE}
          score={zxcvbn(values.password).score}
          withFixWidth
        />
      )}
      <TipText>
        Please, copy & save the master password in a safe place. Relogin will
        not be possible without this password.
      </TipText>
      <StyledButton
        htmlType="submit"
        isHigh={!isMobile && !isWideMobile}
        isUpperCase
        disabled={isSubmitting || !isValid}
      >
        Continue
      </StyledButton>
    </Form>
  );
};

export const MasterPasswordCreateForm = memo(MasterPasswordCreateFormComponent);
