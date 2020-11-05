import React, { memo, useState, useRef } from 'react';
import { useClickAway, useDebounce } from 'react-use';
import styled from 'styled-components';
import { getSearchUser } from '@caesar/common/api';
import { uuid4 } from '@caesar/common/utils/uuid4';
import { getPlural } from '@caesar/common/utils/string';
import {
  DEFAULT_ERROR_MESSAGE,
  // EMAIL_REGEX,
} from '@caesar/common/constants';
import { Input } from './Input';
import { Icon } from '../Icon';
import { CircleLoader } from '../Loader';
import { MemberList } from '../MemberList';
import { Hint } from '../Hint';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

const InputStyled = styled(Input)`
  width: 100%;

  ${Input.InputField} {
    padding-left: 48px;
    padding-right: 48px;
    background-color: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.gallery};
  }
`;

const AddButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.color.gallery : theme.color.black};
  border: 1px solid
    ${({ disabled, theme }) =>
      disabled ? theme.color.gallery : theme.color.black};
  border-radius: 50%;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  ${({ disabled, theme }) =>
    !disabled &&
    `
    &:hover {
      background-color: ${theme.color.emperor};
      border-color: ${theme.color.emperor};
    }
  `};
`;

const SearchedResultBox = styled.div`
  position: absolute;
  top: 42px;
  z-index: ${({ theme }) => theme.zIndex.upBasic};
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 400px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-top: none;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SearchedUsersCount = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.color.gray};
  margin-right: 20px;
`;

const CloseIcon = styled(Icon)`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const createNewUser = email => ({
  id: uuid4(),
  email,
  avatar: null,
  isNew: true,
});

const Prefix = <Icon name="search" width={16} height={16} color="gray" />;

const Postfix = ({
  isLoading,
  users,
  filterText,
  handleClickReset,
  handleAddNewUser,
}) => {
  if (isLoading) {
    return <CircleLoader size={18} />;
  }

  if (users.length && filterText) {
    return (
      <IconWrapper>
        <SearchedUsersCount>
          {users.length} {getPlural(users.length, ['user', 'users'])}
        </SearchedUsersCount>
        <CloseIcon
          name="close"
          width={16}
          height={16}
          color="gray"
          onClick={handleClickReset}
        />
      </IconWrapper>
    );
  }

  if (!isLoading && !users.length && filterText?.includes('@')) {
    // TODO: Uncomment to enable invite users out of domain
    // Also remove Hint
    // const isDisabled = !EMAIL_REGEX.test(filterText);

    return (
      <AddButton disabled onClick={handleAddNewUser}>
        <Hint text="You cannot share the item(-s) with unregistered users">
          <Icon name="plus" width={16} height={16} color="white" />
        </Hint>
      </AddButton>
    );
  }

  return null;
};

const UserSearchInputComponent = ({ blackList, onClickAdd, className }) => {
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [serverError, setServerError] = useState(null);
  const ref = useRef(null);

  useClickAway(ref, () => {
    setFilterText('');
  });

  useDebounce(
    async () => {
      setServerError(null);

      if (!filterText) return;
      setLoading(true);

      try {
        const { data } = await getSearchUser(filterText);

        if (!data) {
          setLoading(false);

          return;
        }

        setUsers(data.filter(user => !blackList?.includes(user.id)));
        setLoading(false);
        // eslint-disable-next-line no-empty
      } catch (error) {
        const errorText = error?.data?.error?.message;

        setServerError(
          typeof errorText === 'string' ? errorText : DEFAULT_ERROR_MESSAGE,
        );
        setLoading(false);
      }
    },
    500,
    [filterText],
  );

  const handleChange = event => {
    const { value } = event.target;

    setFilterText(value);
    setUsers(!value ? [] : users);
  };

  const handleAddNewUser = () => {
    setFilterText('');
    setUsers([]);

    onClickAdd(createNewUser(filterText));
  };

  const handleClickReset = () => {
    setUsers([]);
    setFilterText('');
  };

  const handleClick = user => () => {
    setUsers(users.filter(({ id }) => id !== user.id));
    setFilterText(users.length === 1 ? '' : filterText);

    onClickAdd(user);
  };

  const mappedUsers = users.map(({ name, ...user }) => user);

  const shouldShowResultBox =
    !isLoading && mappedUsers.length > 0 && filterText;

  return (
    <Wrapper className={className} ref={ref}>
      <InputStyled
        placeholder="Enter email addresses…"
        autoComplete="off"
        value={filterText}
        onChange={handleChange}
        prefix={Prefix}
        postfix={
          <Postfix
            isLoading={isLoading}
            users={users}
            filterText={filterText}
            handleClickReset={handleClickReset}
            handleAddNewUser={handleAddNewUser}
          />
        }
        error={serverError}
      />
      {shouldShowResultBox && (
        <SearchedResultBox>
          <MemberList
            members={mappedUsers}
            onClickAdd={handleClick}
            controlType="add"
            maxHeight={240}
          />
        </SearchedResultBox>
      )}
    </Wrapper>
  );
};

const UserSearchInput = memo(UserSearchInputComponent);

export default UserSearchInput;
