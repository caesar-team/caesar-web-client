import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { Dropdown } from '../Dropdown';
import { SearchInput } from '../Input';
import { TeamModal } from '../TeamModal';
import { Logo } from './Logo';

const Wrapper = styled.header`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  max-height: 70px;
  min-height: 70px;
`;

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  flex-shrink: 0;
  padding-left: 60px;
  ${({ withBorder, theme }) =>
    withBorder && `border-right: 1px solid ${theme.gallery}`};
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 0 30px;
`;

const UserSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
`;

const UserAndTeamWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  margin-left: 15px;
  margin-right: 15px;
`;

const TeamName = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const TeamAvatar = styled(Avatar)`
  margin-left: -8px;
`;

const StyledDropdown = styled(Dropdown)`
  display: flex;
  min-width: 200px;
  color: ${({ theme }) => theme.black};
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.emperor};
  }
`;

const Option = styled.div`
  padding: 10px 30px;
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
`;

const Anchor = styled.a`
  color: ${({ theme }) => theme.black};
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.gray};
  }
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
`;

class PrimaryHeader extends PureComponent {
  state = {
    isDropdownOpened: false,
    isModalOpened: false,
  };

  handleChangeTeamId = teamId => {
    const { team } = this.props;

    if (team.id !== teamId) {
      // TODO: change team via store
    }

    this.handleCloseModal();
  };

  handleToggleDropdown = isDropdownOpened => {
    this.setState({
      isDropdownOpened,
    });
  };

  handleShowTeamModal = () => {
    this.setState({
      isDropdownOpened: false,
      isModalOpened: true,
    });
  };

  handleCloseModal = () => {
    this.setState({
      isModalOpened: false,
    });
  };

  render() {
    const {
      user,
      team,
      withSearch = false,
      searchedText,
      onSearch,
      onClickReset,
    } = this.props;
    const { isDropdownOpened, isModalOpened } = this.state;

    const userName = user.name || user.email;

    const Options = (
      <Fragment>
        <Option key="teams" onClick={this.handleShowTeamModal}>
          <Anchor>Switch Team</Anchor>
        </Option>
        <Option key="settings">
          <Link href="/settings">
            <Anchor>Settings</Anchor>
          </Link>
        </Option>
        <Option key="logout">
          <Link href="/logout">
            <Anchor>Logout</Anchor>
          </Link>
        </Option>
      </Fragment>
    );

    return (
      <Fragment>
        <Wrapper>
          <LeftWrapper withBorder={withSearch}>
            <Logo href="/" />
          </LeftWrapper>
          {!!user && (
            <RightWrapper>
              <SearchInput
                searchedText={searchedText}
                onChange={onSearch}
                onClickReset={onClickReset}
              />
              <UserSection>
                <Avatar {...user} name={user.email} />
                <TeamAvatar name={team.title} avatar={team.icon} />
                <StyledDropdown
                  overlay={Options}
                  onToggle={this.handleToggleDropdown}
                >
                  <UserAndTeamWrapper>
                    <UserName>{userName}</UserName>
                    <TeamName>{team.title}</TeamName>
                  </UserAndTeamWrapper>
                  <StyledIcon
                    name={
                      isDropdownOpened ? 'arrow-up-small' : 'arrow-down-small'
                    }
                    width={10}
                    height={16}
                  />
                </StyledDropdown>
              </UserSection>
            </RightWrapper>
          )}
        </Wrapper>
        {isModalOpened && (
          <TeamModal
            teamId={team.id}
            onChangeTeam={this.handleChangeTeamId}
            onCancel={this.handleCloseModal}
          />
        )}
      </Fragment>
    );
  }
}

export default PrimaryHeader;
