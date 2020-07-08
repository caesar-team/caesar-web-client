import React from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { useDispatch } from 'react-redux';
import { Button, Head, Icon, LockInput } from '@caesar/components';
import { Avatar } from '@caesar/components/Avatar';
import { passwordSchema } from './schema';
import { logout } from '@caesar/common/actions/user';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.emperor};
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const User = styled.div`
    display: flex;
    align-items: center;
`;

const UserName = styled.div`
    color: ${({ theme }) => theme.color.white};
`;

const Title = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.lightGray};
  margin-bottom: 36px;
  margin-top: 140px;
`;

const StyledLogo = styled(Icon)`
  fill: ${({ theme }) => theme.color.lightGray};
`;

const MasterPasswordCheckForm = ({ user, onSubmit }) => {
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <Head title="[LOCKED] Caesar"/>
      <Header>
        <StyledLogo name="logo-caesar-4xxi" width={151} height={32}/>
        <User>
          <Avatar {...user} />
          <UserName>{user.name}</UserName>
          <Button onClick={() => dispatch(logout())}>
            Log out
          </Button>
        </User>
      </Header>
      <Title>Enter your master password</Title>
        <Formik
          initialValues={{ password: '' }}
          validationSchema={passwordSchema}
          onSubmit={onSubmit}
          validateOnChange={false}
        >
          {({ errors, handleSubmit, submitForm, resetForm }) => (
            <form onSubmit={handleSubmit}>
              <FastField name="password">
                {({ field }) => (
                  <LockInput
                    {...field}
                    autoFocus
                    maxLength={24}
                    onClick={submitForm}
                    onBackspace={resetForm}
                    isError={errors && Object.keys(errors).length !== 0}
                  />
                )}
              </FastField>
            </form>
          )}
        </Formik>
      </Wrapper>
    );
};

export default MasterPasswordCheckForm;
