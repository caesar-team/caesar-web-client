import React, { memo, useState, useRef } from 'react';
import { useClickAway } from 'react-use';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { getSearchUser } from '@caesar/common/api';
import { uuid4 } from '@caesar/common/utils/uuid4';
import { Input } from './Input';
import { Icon } from '../Icon';
import { CircleLoader } from '../Loader';
import { MemberList } from '../MemberList';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

const createNewMember = email => ({
  id: uuid4(),
  email,
  avatar: null,
  isNew: true,
});

function UserSearchInputComponent({ blackList, onClickAdd, className }) {
  const [isLoading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [filterText, setFilterText] = useState('');
  
  const ref = useRef(null);
  
  useClickAway(ref, () => {
    setFilterText('');
  });

  const handleAddNewMember = () => {
    setFilterText('');
    setMembers([]);

    onClickAdd(createNewMember(filterText));
  };
  
  const getPostfix = () => {
    if (isLoading) {
      return <CircleLoader size={18} />;
    }

    if (members.length && filterText) {
      return (
        <IconWrapper>
          <SearchedUsersCount>
            {members.length} member{members.length === 1 ? '' : 's'}
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

    if (
      !isLoading &&
      !members.length &&
      filterText &&
      filterText.includes('@')
    ) {
      const isDisabled = !EMAIL_REGEX.test(filterText);

      return (
        <AddButton disabled={isDisabled} onClick={handleAddNewMember}>
          <Icon name="plus" width={16} height={16} color="white" />
        </AddButton>
      );
    }

    return null;
  }

  // eslint-disable-next-line
  const handleChange = event => {
    const {
      target: { value },
    } = event;

    setFilterText(value);
    setMembers(!value ? [] : members);

    debouncedSearch(value);
  };

  const handleClick = member => () => {
    setMembers(members.filter(({ id }) => id !== member.id));
    setFilterText(members.length === 1 ? '' : filterText);

    onClickAdd(member);
  };

  const handleClickReset = () => {
    setMembers([]);
    setFilterText('');
  };

  const search = async text => {
    if (!text) return;

    setLoading(true);

    const { data } = await getSearchUser(text);

    setMembers(data.filter(member => !blackList.includes(member.id)));
    setLoading(false);
  };

  // eslint-disable-next-line
  const debouncedSearch = debounce(search, 500);

  const mappedMembers = members.map(({ name, ...member }) => member);

  const Prefix = <Icon name="search" width={16} height={16} color="gray" />;
  const Postfix = getPostfix();

  const shouldShowResultBox = !isLoading && mappedMembers.length > 0 && filterText;
  
  return (
    <Wrapper className={className} ref={ref}>
      <InputStyled
        placeholder="Enter email addresses…"
        autoComplete="off"
        value={filterText}
        onChange={handleChange}
        prefix={Prefix}
        postfix={Postfix}
      />
      {shouldShowResultBox && (
        <SearchedResultBox>
          <MemberList
            members={mappedMembers}
            onClickAdd={handleClick}
            controlType="add"
            maxHeight={240}
          />
        </SearchedResultBox>
      )}
    </Wrapper>
  );
}

const UserSearchInput = memo(UserSearchInputComponent);

export default UserSearchInput;
