/* eslint-disable camelcase */
import React, { Component, createRef } from 'react';
import { withRouter } from 'next/router';
import memoizeOne from 'memoize-one';
import styled from 'styled-components';
import {
  Button,
  SettingsWrapper,
  DataTable,
  Avatar,
  Input,
  Select,
  DottedMenu,
  Icon,
  InviteModal,
  Can,
  ConfirmModal,
  ConfirmLeaveTeamModal,
} from '@caesar/components';
import {
  COMMANDS_ROLES,
  PERMISSION,
  PERMISSION_ENTITY,
  ROUTES,
  TEAM_TYPE,
} from '@caesar/common/constants';
import { getTeamTitle } from '@caesar/common/utils/team';
import { sortByName } from '@caesar/common/utils/utils';

const ButtonStyled = styled(Button)`
  margin-right: 24px;
`;

const DataTableStyled = styled(DataTable)`
  height: 100%;
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
    height: 56px;
    max-height: 56px;
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
  height: 56px;
`;

const NameField = styled(Field)`
  padding-left: 24px;
`;

const Name = styled.div`
  margin-left: 24px;
`;

const Email = styled.div`
  color: ${({ theme }) => theme.color.gray};
`;

const HeaderField = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.color.black};
  background-color: ${({ theme }) => theme.color.alto};
`;

const NameHeaderField = styled(HeaderField)`
  padding-left: 20px;
`;

const HeaderFieldName = styled.div`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.lightGray};
  text-transform: uppercase;
`;

const RoleField = styled(Field)``;

const MenuField = styled(Field)`
  position: relative;
  justify-content: flex-end;
  padding-right: 24px;
`;

const MenuWrapper = styled.div`
  width: 100%;
  height: 32px;
  position: absolute;
`;

const MenuButton = styled(Button)`
  width: 100%;
  height: 32px;
`;

const SelectStyled = styled(Select)`
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.color.gallery};
  width: 136px;
  height: 38px;
`;

const InputStyled = styled(Input)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 32px;
  padding: 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.black};

  ${Input.Prefix} {
    position: relative;
    left: 0;
    height: 32px;
    margin-right: 8px;
    line-height: 32px;
  }

  ${Input.InputField} {
    padding: 0;
    font-size: ${({ theme }) => theme.font.size.small};
    background-color: transparent;
    border-bottom: none;
  }
`;

const SearchIcon = styled(Icon)`
  width: 14px;
  height: 14px;
  fill: ${({ theme }) => theme.color.gray};
`;

const INVITE_MEMBER_MODAL = 'inviteMemberModal';
const LEAVE_TEAM_MODAL = 'leaveTeamModal';
const REMOVE_TEAM_MODAL = 'removeTeamModal';

const ROW_HEIGHT = 56;
const WRAPPER_PADDING = 60 * 2;
const WIDTH_RATIO = {
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

    const getTeamMemberSubject = member => ({
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
        const isDropdownUp = pageSize >= 4 && isLastTwoInList;

        return (
          <RoleField>
            <Can I={PERMISSION.EDIT} of={getTeamMemberSubject(original)}>
              <SelectStyled
                name="role"
                value={original.role}
                options={OPTIONS}
                onChange={this.handleChangeRole(original.id)}
                boxDirection={isDropdownUp ? 'up' : 'down'}
              />
            </Can>
            <Can not I={PERMISSION.EDIT} of={getTeamMemberSubject(original)}>
              {original.role}
            </Can>
          </RoleField>
        );
      },
      Header: (
        <HeaderField>
          <HeaderFieldName>Role</HeaderFieldName>
        </HeaderField>
      ),
    };

    const menuColumn = {
      sortable: false,
      resizable: false,
      width: columnWidths.menu,
      Cell: ({ original }) => (
        <MenuField>
          <Can I={PERMISSION.DELETE} a={getTeamMemberSubject(original)}>
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
      name: wrapperWidth * WIDTH_RATIO.name,
      email: wrapperWidth * WIDTH_RATIO.email,
      role: wrapperWidth * WIDTH_RATIO.role,
      menu: wrapperWidth * WIDTH_RATIO.menu,
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

  handleLeaveTeam = () => {
    this.props.leaveTeamRequest(this.props.team.id);
  };

  handleRemoveTeam = () => {
    this.props.removeTeamRequest(this.props.team.id);
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

    if (!team) {
      this.props.router.push(ROUTES.SETTINGS + ROUTES.TEAM);

      return null;
    }

    const members = this.getMemberList(team.users, membersById);
    const filteredMembersList = this.filterMemberList(
      team.users,
      filter,
      membersById,
    ).sort((a, b) => sortByName(a.name, b.name));

    const teamSubject = {
      __typename: PERMISSION_ENTITY.TEAM,
      team_delete: !!team?._links?.team_delete,
    };

    const teamMemberSubject = {
      __typename: PERMISSION_ENTITY.TEAM_MEMBER,
      team_member_add: !!team?._links?.team_member_add,
    };

    const isDomainTeam =
      team.type === TEAM_TYPE.DEFAULT ||
      team.title.toLowerCase() === TEAM_TYPE.DEFAULT;

    return (
      <SettingsWrapper
        isLoading={isLoading}
        ref={this.wrapperRef}
        title={`${getTeamTitle(team)} (${filteredMembersList.length})`}
        addonTopComponent={
          <>
            <Can I={PERMISSION.DELETE} a={teamSubject}>
              <ButtonStyled
                withOfflineCheck
                icon="trash"
                color="white"
                onClick={this.handleOpenModal(REMOVE_TEAM_MODAL)}
              />
            </Can>
            {!isDomainTeam && (
              <ButtonStyled
                withOfflineCheck
                icon="leave"
                color="white"
                onClick={this.handleOpenModal(LEAVE_TEAM_MODAL)}
              />
            )}
            <Can I={PERMISSION.ADD} a={teamMemberSubject}>
              <ButtonStyled
                withOfflineCheck
                onClick={this.handleOpenModal(INVITE_MEMBER_MODAL)}
                icon="plus"
                color="black"
              >
                Add a member
              </ButtonStyled>
            </Can>
          </>
        }
      >
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
        <ConfirmModal
          isOpened={modalVisibilities[REMOVE_TEAM_MODAL]}
          description="Are you sure you want to remove team?"
          onClickConfirm={this.handleRemoveTeam}
          onClickCancel={this.handleCloseModal(REMOVE_TEAM_MODAL)}
        />
        <ConfirmLeaveTeamModal
          isOpened={modalVisibilities[LEAVE_TEAM_MODAL]}
          teamTitle={team.title}
          onClickConfirm={this.handleLeaveTeam}
          onClickCancel={this.handleCloseModal(LEAVE_TEAM_MODAL)}
        />
      </SettingsWrapper>
    );
  }
}

export default withRouter(TeamContainer);
