import React, { Component } from 'react';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { getSearchUser } from 'common/api';
import { Input } from '../../Input';
import { Icon } from '../../Icon';
import { CircleLoader } from '../../Loader';
import { MemberList } from '../../MemberList';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 20px;
  width: 100%;
`;

const InputStyled = styled(Input)`
  width: 100%;
  height: 50px;

  ${Input.InputField} {
    height: 48px;
    font-size: 16px;
    letter-spacing: 0.5px;
    padding: 15px 20px 15px 50px;
    border: 1px solid ${({ theme }) => theme.gallery};
    background-color: ${({ theme }) => theme.white};
  }
`;

const SearchedResultBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.gallery};
  border-top: none;
  max-height: 400px;
  position: absolute;
  z-index: 11;
  top: 47px;
  width: 100%;
`;

const SearchIcon = styled(Icon)`
  width: 18px;
  height: 18px;
  fill: ${({ theme }) => theme.gallery};
`;

const SearchedUsersCount = styled.div`
  font-size: 12px;
  letter-spacing: 0.34px;
  color: ${({ theme }) => theme.gray};
`;

class MemberSearchInput extends Component {
  state = this.prepareInitialState();

  getPostfix() {
    const { members, filterText, isLoading } = this.state;

    if (isLoading) {
      return <CircleLoader size={18} />;
    }

    if (members.length && filterText) {
      return (
        <SearchedUsersCount>
          {members.length} member{members.length === 1 ? '' : 's'}
        </SearchedUsersCount>
      );
    }

    return null;
  }

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
    }));

    onClickAdd(member);
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

    const Prefix = <SearchIcon name="search" />;
    const Postfix = this.getPostfix();

    const shouldShowResultBox = !isLoading && members.length > 0 && filterText;

    return (
      <Wrapper className={className}>
        <InputStyled
          placeholder="Enter email addresses…"
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
            />
          </SearchedResultBox>
        )}
      </Wrapper>
    );
  }
}

export default MemberSearchInput;
