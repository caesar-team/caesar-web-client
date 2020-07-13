import React from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Button, Head, LogoCaesarDomain, LockInput } from '@caesar/components';
import { Avatar } from '@caesar/components/Avatar';
import { logout } from '@caesar/common/actions/user';
import { passwordSchema } from './schema';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.emperor};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.color.lighterGray};
`;

const User = styled.div`
  display: flex;
  align-items: center;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 16px;
`;

const UserName = styled.div`
  margin-right: 24px;
  color: ${({ theme }) => theme.color.white};

  ${media.wideMobile`
      display: none;
    `};
`;

const Title = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.lightGray};
  margin-bottom: 36px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const MasterPasswordCheckForm = ({ user, onSubmit }) => {
  const dispatch = useDispatch();
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    submitForm,
    resetForm,
  } = useFormik({
    initialValues: { password: '' },
    onSubmit,
    validationSchema: passwordSchema,
    validateOnChange: false,
  });

  return (
    <Wrapper>
      <Head title="[LOCKED] Caesar" />
      <Header>
        <LogoCaesarDomain color="lightGray" />
        <User>
          <StyledAvatar {...user} width={32} fontSize="small" />
          <UserName>{user.name}</UserName>
          <Button color="gray" onClick={() => dispatch(logout())}>
            Log out
          </Button>
        </User>
      </Header>
      <FormWrapper>
        <Title>Enter your master password</Title>
        <form onSubmit={handleSubmit}>
          <LockInput
            name="password"
            value={values.password}
            autoFocus
            maxLength={24}
            onChange={handleChange}
            onClick={submitForm}
            onBackspace={resetForm}
            isError={errors && Object.keys(errors).length !== 0}
          />
        </form>
      </FormWrapper>
    </Wrapper>
  );
};

export default MasterPasswordCheckForm;
