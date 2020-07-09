import React from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import { Formik, FastField } from 'formik';
import { useDispatch } from 'react-redux';
import { Button, Head, Icon, LockInput } from '@caesar/components';
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
    padding: 12px 24px 12px 0;
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

const StyledLogo = styled(Icon)`
  fill: ${({ theme }) => theme.color.lightGray};
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

  return (
    <Wrapper>
      <Head title="[LOCKED] Caesar"/>
      <Header>
        <StyledLogo name="logo-caesar-4xxi" width={151} height={32}/>
        <User>
          <StyledAvatar {...user} isSmall />
          <UserName>{user.name}</UserName>
          <Button color="gray" onClick={() => dispatch(logout())}>
            Log out
          </Button>
        </User>
      </Header>
      <FormWrapper>
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
       </FormWrapper>
      </Wrapper>
    );
};

export default MasterPasswordCheckForm;
