import React, { Component } from 'react';
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
  z-index: ${({ theme }) => theme.zIndex.basic};
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

class UserSearchInput extends Component {
  state = this.prepareInitialState();

  getPostfix() {
    const { members, filterText, isLoading } = this.state;

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
            onClick={this.handleClickReset}
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
        <AddButton disabled={isDisabled} onClick={this.handleAddNewMember}>
          <Icon name="plus" width={16} height={16} color="white" />
        </AddButton>
      );
    }

    return null;
  }

  handleAddNewMember = () => {
    const { onClickAdd } = this.props;
    const { filterText } = this.state;

    this.setState({
      filterText: '',
      members: [],
    });

    onClickAdd(createNewMember(filterText));
  };

  // eslint-disable-next-line
  handleChange = event => {
    const {
      target: { value },
    } = event;

    this.setState(
      prevState => ({
        ...prevState,
        filterText: value,
        members: !value ? [] : prevState.members,
      }),
      () => this.debouncedSearch(value),
    );
  };

  handleClick = member => () => {
    const { onClickAdd } = this.props;

    this.setState(prevState => ({
      ...prevState,
      members: prevState.members.filter(({ id }) => id !== member.id),
      filterText: prevState.members.length === 1 ? '' : prevState.filterText,
    }));

    onClickAdd(member);
  };

  handleClickReset = () => {
    this.setState({
      members: [],
      filterText: '',
    });
  };

  search = async text => {
    const { blackList } = this.props;

    if (!text) return;

    this.setState({ isLoading: true });

    const { data } = await getSearchUser(text);

    this.setState({
      members: data.filter(member => !blackList.includes(member.id)),
      isLoading: false,
    });
  };

  // eslint-disable-next-line
  debouncedSearch = debounce(this.search, 500);

  prepareInitialState() {
    return {
      members: [],
      filterText: '',
      isLoading: false,
    };
  }

  render() {
    const { className } = this.props;
    const { filterText, isLoading } = this.state;

    const members = this.state.members.map(({ name, ...member }) => member);

    const Prefix = <Icon name="search" width={16} height={16} color="gray" />;
    const Postfix = this.getPostfix();

    const shouldShowResultBox = !isLoading && members.length > 0 && filterText;

    return (
      <Wrapper className={className}>
        <InputStyled
          placeholder="Enter email addresses…"
          autoComplete="off"
          value={filterText}
          onChange={this.handleChange}
          prefix={Prefix}
          postfix={Postfix}
        />
        {shouldShowResultBox && (
          <SearchedResultBox>
            <MemberList
              members={members}
              onClickAdd={this.handleClick}
              controlType="add"
              maxHeight={240}
            />
          </SearchedResultBox>
        )}
      </Wrapper>
    );
  }
}

export default UserSearchInput;
