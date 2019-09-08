import React, { Component, createRef } from 'react';
import { withRouter } from 'next/router';
import memoizeOne from 'memoize-one';
import styled from 'styled-components';
import {
  Button,
  LogoLoader,
  DataTable,
  Avatar,
  Input,
  Select,
  DottedMenu,
  Icon,
} from 'components';
import { COMMANDS_ROLES } from 'common/constants';

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.lightBlue};
  width: 100%;
  position: relative;
  height: calc(100vh - 70px);
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.lightBlue};
  width: 100%;
  max-width: calc(100vw - 300px);
  padding: 60px;
  position: relative;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Title = styled.div`
  font-size: 36px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.black};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonStyled = styled(Button)`
  margin-right: 20px;
`;

const DataTableStyled = styled(DataTable)`
  max-height: 400px;
  border: none;

  .rt-resizable-header-content {
    padding: 0;
  }

  .rt-tr-group {
    margin-bottom: 10px;
    height: 50px;
    max-height: 50px;
  }

  .rt-thead.-header {
    margin-bottom: 20px;
  }

  .rt-th {
    padding: 0 20px;
  }

  .rt-td {
    overflow: initial;
  }

  .rt-th > * {
    width: 100%;
  }

  .rt-thead .rt-resizable-header-content {
    width: 100%;
  }

  .rt-noData {
    display: none;
  }
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  height: 50px;
`;

const NameField = styled(Field)`
  padding-left: 20px;
`;

const Name = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  margin-left: 20px;
`;

const Email = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.gray};
`;

const HeaderField = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.lightBlue};
`;

const NameHeaderField = styled(HeaderField)`
  padding-left: 20px;
`;

const HeaderFieldName = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.47px;
  color: ${({ theme }) => theme.gray};
`;

const RoleField = styled(Field)`
  & > * {
    position: absolute;
  }
`;

const MenuField = styled(Field)`
  position: relative;
  justify-content: flex-end;
  padding-right: 20px;
`;

const MenuButton = styled(Button)`
  width: 100%;
  height: 50px;
  position: absolute;
`;

const SelectStyled = styled(Select)`
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.gallery};
  width: 136px;
  height: 38px;
`;

const InputStyled = styled(Input)`
  width: 100%;
  height: 50px;
  border-bottom: 1px solid ${({ theme }) => theme.black};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  ${Input.Prefix} {
    position: relative;
    margin-right: 10px;
    height: 50px;
    line-height: 50px;
    left: 0;
  }

  ${Input.InputField} {
    border-bottom: none;
    padding: 15px 0;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.47px;
    color: ${({ theme }) => theme.gray};
    background-color: ${({ theme }) => theme.lightBlue};
  }
`;

const SearchIcon = styled(Icon)`
  width: 14px;
  height: 14px;
  fill: ${({ theme }) => theme.gray};
`;

const ROW_HEIGHT = 50;
const WRAPPER_PADDING = 60 * 2;
const WIDTH_COEFFS = {
  name: 0.35,
  email: 0.35,
  role: 0.2,
  menu: 0.1,
};

const OPTIONS = [
  {
    value: COMMANDS_ROLES.USER_ROLE_ADMIN,
    label: COMMANDS_ROLES.USER_ROLE_ADMIN,
  },
  {
    value: COMMANDS_ROLES.USER_ROLE_MEMBER,
    label: COMMANDS_ROLES.USER_ROLE_MEMBER,
  },
  {
    value: COMMANDS_ROLES.USER_ROLE_GUEST,
    label: COMMANDS_ROLES.USER_ROLE_GUEST,
  },
];

const Prefix = <SearchIcon name="search" />;

const searchFn = patterns => member =>
  Object.keys(patterns).every(
    fieldName =>
      member[fieldName] &&
      member[fieldName]
        .toLowerCase()
        .includes(patterns[fieldName].toLowerCase()),
  );

class TeamContainer extends Component {
  state = this.prepareInitialState();

  wrapperRef = createRef();

  filterMemberList = memoizeOne((users, filter, membersById) =>
    this.getMemberList(users, membersById).filter(searchFn(filter)),
  );

  componentDidMount() {
    this.props.fetchTeamRequest(this.props.router.query.id);
    this.props.fetchTeamMembersRequest(this.props.router.query.id);
  }

  getMemberList = memoizeOne((users, membersById) =>
    users.reduce(
      (accumulator, user) => [
        ...accumulator,
        { ...membersById[user.id], role: user.role },
      ],
      [],
    ),
  );

  getColumns() {
    const { filter } = this.state;

    const columnWidths = this.calculateColumnWidths();

    const nameColumn = {
      id: 'name',
      accessor: 'name',
      sortable: false,
      resizable: false,
      width: columnWidths.name,
      Cell: ({ original }) => (
        <NameField>
          <Avatar isSmall {...original} />
          <Name>{original.name}</Name>
        </NameField>
      ),
      Header: (
        <NameHeaderField>
          <InputStyled
            name="name"
            placeholder="NAME"
            prefix={Prefix}
            value={filter.name}
            onChange={this.handleChangeFilter('name')}
          />
        </NameHeaderField>
      ),
    };

    const emailColumn = {
      id: 'email',
      accessor: 'email',
      sortable: false,
      resizable: false,
      width: columnWidths.email,
      Cell: ({ original }) => (
        <Field>
          <Email>{original.email}</Email>
        </Field>
      ),
      Header: (
        <HeaderField>
          <InputStyled
            name="email"
            placeholder="EMAIL"
            prefix={Prefix}
            value={filter.email}
            onChange={this.handleChangeFilter('email')}
          />
        </HeaderField>
      ),
    };

    const roleColumn = {
      id: 'role',
      accessor: 'role',
      sortable: false,
      resizable: false,
      width: columnWidths.role,
      Cell: ({ original }) => (
        <RoleField>
          <SelectStyled
            name="role"
            value={original.role}
            options={OPTIONS}
            onChange={this.handleChangeRole(original.id)}
          />
        </RoleField>
      ),
      Header: (
        <HeaderField>
          <HeaderFieldName>ROLE</HeaderFieldName>
        </HeaderField>
      ),
    };

    const menuColumn = {
      sortable: false,
      resizable: false,
      width: columnWidths.menu,
      Cell: ({ original }) => (
        <MenuField>
          <DottedMenu
            tooltipProps={{
              textBoxWidth: '100px',
              arrowAlign: 'start',
              position: 'left center',
            }}
          >
            <MenuButton
              color="white"
              onClick={this.handleRemoveMember(original.id)}
            >
              Remove
            </MenuButton>
          </DottedMenu>
        </MenuField>
      ),
      Header: <HeaderField />,
    };

    return [nameColumn, emailColumn, roleColumn, menuColumn];
  }

  calculateWrapperWidth = () => {
    return this.wrapperRef.current
      ? this.wrapperRef.current.offsetWidth - WRAPPER_PADDING
      : 0;
  };

  calculateColumnWidths = () => {
    const wrapperWidth = this.calculateWrapperWidth();

    return {
      name: wrapperWidth * WIDTH_COEFFS.name,
      email: wrapperWidth * WIDTH_COEFFS.email,
      role: wrapperWidth * WIDTH_COEFFS.role,
      menu: wrapperWidth * WIDTH_COEFFS.menu,
    };
  };

  handleChangeFilter = type => event => {
    const {
      target: { value },
    } = event;

    this.setState(prevState => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        [type]: value,
      },
    }));
  };

  handleChangeRole = userId => (_, value) => {
    this.props.updateTeamMemberRoleRequest(this.props.team.id, userId, value);
  };

  handleRemoveMember = userId => () => {
    this.props.removeTeamMemberRequest(this.props.team.id, userId);
  };

  prepareInitialState() {
    return {
      filter: {
        name: '',
        email: '',
      },
    };
  }

  render() {
    const { isLoading, team, user, membersById } = this.props;
    const { filter } = this.state;

    if (isLoading) {
      return (
        <LogoWrapper>
          <LogoLoader textColor="black" />
        </LogoWrapper>
      );
    }

    const membersList = this.filterMemberList(
      team.users.filter(({ id }) => id !== user.id),
      filter,
      membersById,
    );

    return (
      <Wrapper ref={this.wrapperRef}>
        <TopWrapper>
          <Title>{team.title}</Title>
          <ButtonsWrapper>
            <ButtonStyled
              withOfflineCheck
              onClick={this.handleClickCreateTeam}
              icon="plus"
              color="black"
            >
              ADD MEMBER
            </ButtonStyled>
            <Button
              withOfflineCheck
              onClick={Function.prototype}
              icon="trash"
              color="white"
            >
              REMOVE
            </Button>
          </ButtonsWrapper>
        </TopWrapper>
        <DataTableStyled
          noDataText={null}
          itemSize={ROW_HEIGHT}
          data={membersList}
          showPagination={false}
          defaultPageSize={membersList.length}
          columns={this.getColumns()}
          width={this.calculateWrapperWidth()}
        />
      </Wrapper>
    );
  }
}

export default withRouter(TeamContainer);
