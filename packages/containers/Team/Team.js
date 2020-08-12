/* eslint-disable camelcase */
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
  InviteModal,
  Can,
} from '@caesar/components';
import {
  COMMANDS_ROLES,
  PERMISSION,
  PERMISSION_ENTITY,
} from '@caesar/common/constants';
import { getTeamTitle } from '@caesar/common/utils/team';

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.lightBlue};
  width: 100%;
  position: relative;
  height: calc(100vh - 55px);
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.lightBlue};
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
  color: ${({ theme }) => theme.color.black};
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
  border: none;

  .rt-table,
  .rt-tbody {
    overflow: initial;
  }

  .rt-tbody {
    height: calc(100vh - 340px);
    overflow: scroll;
  }

  .rt-resizable-header-content {
    padding: 0;
  }

  .rt-tbody .rt-tr-group {
    border-bottom: none;
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
  background-color: ${({ theme }) => theme.color.white};
  height: 50px;
`;

const NameField = styled(Field)`
  padding-left: 20px;
`;

const Name = styled.div`
  font-size: 18px;
  margin-left: 20px;
`;

const Email = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.color.gray};
`;

const HeaderField = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid ${({ theme }) => theme.color.black};
  background-color: ${({ theme }) => theme.color.lightBlue};
`;

const NameHeaderField = styled(HeaderField)`
  padding-left: 20px;
`;

const HeaderFieldName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.gray};
`;

const RoleField = styled(Field)``;

const MenuField = styled(Field)`
  position: relative;
  justify-content: flex-end;
  padding-right: 20px;
`;

const MenuWrapper = styled.div`
  width: 100%;
  height: 50px;
  position: absolute;
`;

const MenuButton = styled(Button)`
  width: 100%;
  height: 50px;
`;

const SelectStyled = styled(Select)`
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  width: 136px;
  height: 38px;
`;

const InputStyled = styled(Input)`
  width: 100%;
  height: 50px;
  border-bottom: 1px solid ${({ theme }) => theme.color.black};
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
    color: ${({ theme }) => theme.color.gray};
    background-color: ${({ theme }) => theme.color.lightBlue};
  }
`;

const SearchIcon = styled(Icon)`
  width: 14px;
  height: 14px;
  fill: ${({ theme }) => theme.color.gray};
`;

const INVITE_MEMBER_MODAL = 'inviteMemberModal';

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
    this.props.initWorkflow();
  }

  getMemberList = memoizeOne((users, membersById) =>
    users.reduce(
      (accumulator, user) => [
        ...accumulator,
        { ...membersById[user.id], role: user.role, _links: user._links },
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
          <Avatar size={32} fontSize="small" {...original} />
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

    const getMemberSubject = member => ({
      __typename: PERMISSION_ENTITY.TEAM_MEMBER,
      team_member_edit: !!member?._links?.team_member_edit,
      team_member_remove: !!member?._links?.team_member_remove,
    });

    const roleColumn = {
      id: 'role',
      accessor: 'role',
      sortable: false,
      resizable: false,
      width: columnWidths.role,
      Cell: ({ original, pageSize, viewIndex }) => {
        const isLastTwoInList = pageSize - viewIndex <= 2;

        return (
          <RoleField>
            <Can I={PERMISSION.EDIT} of={getMemberSubject(original)}>
              <SelectStyled
                name="role"
                value={original.role}
                options={OPTIONS}
                onChange={this.handleChangeRole(original.id)}
                boxDirection={isLastTwoInList ? 'up' : 'down'}
              />
            </Can>
            <Can not I={PERMISSION.EDIT} of={getMemberSubject(original)}>
              {original.role}
            </Can>
          </RoleField>
        );
      },
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
          <Can I={PERMISSION.DELETE} a={getMemberSubject(original)}>
            <DottedMenu
              tooltipProps={{
                textBoxWidth: '100px',
                arrowAlign: 'start',
                position: 'left center',
                padding: '0px 0px',
                flat: true,
              }}
            >
              <MenuWrapper>
                <MenuButton
                  color="white"
                  onClick={this.handleRemoveMember(original.id)}
                >
                  Remove
                </MenuButton>
              </MenuWrapper>
            </DottedMenu>
          </Can>
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

  handleOpenModal = modal => () => {
    this.setState(prevState => ({
      ...prevState,
      modalVisibilities: {
        ...prevState.modalVisibilities,
        [modal]: true,
      },
    }));
  };

  handleCloseModal = modal => () => {
    this.setState(prevState => ({
      ...prevState,
      modalVisibilities: {
        ...prevState.modalVisibilities,
        [modal]: false,
      },
    }));
  };

  handleInvite = members => {
    this.props.addTeamMembersBatchRequest(this.props.team.id, members);
    this.handleCloseModal(INVITE_MEMBER_MODAL)();
  };

  prepareInitialState() {
    return {
      filter: {
        name: '',
        email: '',
      },
      modalVisibilities: {
        [INVITE_MEMBER_MODAL]: false,
      },
    };
  }

  render() {
    const { isLoading, team, user, membersById } = this.props;
    const { filter, modalVisibilities } = this.state;

    if (isLoading) {
      return (
        <LogoWrapper>
          <LogoLoader textColor="black" />
        </LogoWrapper>
      );
    }

    const members = this.getMemberList(team.users, membersById);
    const filteredMembersList = this.filterMemberList(
      team.users,
      filter,
      membersById,
    );

    const teamSubject = {
      __typename: PERMISSION_ENTITY.TEAM_MEMBER,
      team_member_add: !!team?._links?.team_member_add,
    };

    return (
      <Wrapper ref={this.wrapperRef}>
        <TopWrapper>
          <Title>{getTeamTitle(team)}</Title>
          <Can I={PERMISSION.ADD} a={teamSubject}>
            <ButtonsWrapper>
              <ButtonStyled
                withOfflineCheck
                onClick={this.handleOpenModal(INVITE_MEMBER_MODAL)}
                icon="plus"
                color="black"
              >
                Add a member
              </ButtonStyled>
            </ButtonsWrapper>
          </Can>
        </TopWrapper>
        <DataTableStyled
          noDataText={null}
          showPagination={false}
          itemSize={ROW_HEIGHT}
          data={filteredMembersList}
          pageSize={filteredMembersList.length}
          columns={this.getColumns()}
          width={this.calculateWrapperWidth()}
        />
        {modalVisibilities[INVITE_MEMBER_MODAL] && (
          <InviteModal
            user={user}
            teamId={team.id}
            invitedMembers={members}
            onAddMember={this.handleAddMember}
            onRemoveMember={this.handleRemoveMember}
            onChangeMemberRole={this.handleChangeMemberRole}
            onCancel={this.handleCloseModal(INVITE_MEMBER_MODAL)}
            onSubmit={this.handleInvite}
          />
        )}
      </Wrapper>
    );
  }
}

export default withRouter(TeamContainer);
