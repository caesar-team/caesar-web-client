/* eslint-disable camelcase */
import React, { useState, useCallback, useMemo } from 'react';
import { useUpdateEffect } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import memoizeOne from 'memoize-one';
import styled from 'styled-components';
import { isLoadingSelector } from '@caesar/common/selectors/workflow';
import { userDataSelector } from '@caesar/common/selectors/user';
import {
  isLoadingTeamsSelector,
  teamSelector,
} from '@caesar/common/selectors/entities/team';
import { membersByIdSelector } from '@caesar/common/selectors/entities/member';
import {
  addTeamMembersBatchRequest,
  removeTeamMemberRequest,
  updateTeamMemberRoleRequest,
  removeTeamRequest,
} from '@caesar/common/actions/entities/team';
import { leaveTeamRequest } from '@caesar/common/actions/entities/member';
import {
  Button,
  SettingsWrapper,
  Can,
  DataTable,
  TableStyles as Table,
  InviteModal,
  ConfirmModal,
  ConfirmLeaveTeamModal,
} from '@caesar/components';
import {
  PERMISSION,
  PERMISSION_ENTITY,
  ROUTES,
  TEAM_TYPE,
  USER_ROLE_ADMIN,
} from '@caesar/common/constants';
import { getTeamTitle } from '@caesar/common/utils/team';
import {
  INVITE_MEMBER_MODAL,
  LEAVE_TEAM_MODAL,
  REMOVE_TEAM_MODAL,
} from './constants';
import { createColumns } from './createColumns';

const ButtonStyled = styled(Button)`
  margin-right: 24px;
`;

const AddMemberButton = styled(ButtonStyled)`
  margin-right: 0;
`;

const getMemberList = memoizeOne((users = [], membersById) =>
  users.reduce(
    (accumulator, user) => [
      ...accumulator,
      {
        ...membersById[user.id],
        role: user.role,
        _permissions: user._permissions,
      },
    ],
    [],
  ),
);

export const TeamContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [modalVisibilities, setModalVisibilities] = useState({
    [INVITE_MEMBER_MODAL]: false,
    [LEAVE_TEAM_MODAL]: false,
    [REMOVE_TEAM_MODAL]: false,
  });
  const isLoading = useSelector(isLoadingSelector);
  const isLoadingTeams = useSelector(isLoadingTeamsSelector);

  // Window height minus stuff that takes vertical place (including table headers)
  const tableVisibleDataHeight = window?.innerHeight - 275;
  const [tableRowGroupNode, setTableRowGroupNode] = useState(null);
  const [tableWidth, setTableWidth] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setTableWidth(node.getBoundingClientRect().width);
      // To calculate where roleDropdown must be opened
      setTableRowGroupNode(node.children[0]?.children[1].children[0]);
    }
  }, []);

  const tableHeight = tableRowGroupNode?.offsetHeight;
  const [tableScrollTop, setTableScrollTop] = useState(0);

  useUpdateEffect(() => {
    if (!tableRowGroupNode) {
      return false;
    }

    const handler = () => {
      setTableScrollTop(tableRowGroupNode.scrollTop);
    };

    tableRowGroupNode.addEventListener('scroll', handler);

    return () => tableRowGroupNode.removeEventListener('scroll', handler);
  }, [tableRowGroupNode]);

  const user = useSelector(userDataSelector);
  const team =
    useSelector(state => teamSelector(state, { teamId: router.query.id })) ||
    {};
  const membersById = useSelector(membersByIdSelector);
  const members = getMemberList(team.users, membersById);
  const tableData = useMemo(() => members, [members]);

  const handleChangeRole = userId => (_, value) => {
    dispatch(updateTeamMemberRoleRequest(team.id, userId, value));
  };

  const handleRemoveMember = userId => () => {
    dispatch(removeTeamMemberRequest(team.id, userId));
  };

  const columns = useMemo(
    () =>
      createColumns({
        tableWidth,
        tableHeight,
        tableScrollTop,
        handleChangeRole,
        handleRemoveMember,
      }),
    [tableWidth, tableHeight, tableScrollTop],
  );

  const handleOpenModal = modal => () => {
    setModalVisibilities({
      ...modalVisibilities,
      [modal]: true,
    });
  };

  const handleCloseModal = modal => () => {
    setModalVisibilities({
      ...modalVisibilities,
      [modal]: false,
    });
  };

  const handleInvite = invitedMembers => {
    addTeamMembersBatchRequest(team.id, invitedMembers);
    handleCloseModal(INVITE_MEMBER_MODAL)();
  };

  const handleLeaveTeam = () => {
    dispatch(leaveTeamRequest(team.id));
  };

  const handleRemoveTeam = () => {
    dispatch(removeTeamRequest(team.id));
  };

  if (!team.id && !isLoadingTeams) {
    router.push(ROUTES.SETTINGS + ROUTES.TEAM);

    return null;
  }

  const teamSubject = {
    __typename: PERMISSION_ENTITY.TEAM,
    team_delete: team._permissions?.team_delete || false,
  };

  const teamMemberSubject = {
    __typename: PERMISSION_ENTITY.TEAM_MEMBER,
    team_member_add:
      team._permissions?.team_member_add ||
      team.userRole === USER_ROLE_ADMIN ||
      false,
  };

  const isDomainTeam =
    team.type === TEAM_TYPE.DEFAULT ||
    team.title?.toLowerCase() === TEAM_TYPE.DEFAULT;

  return (
    <SettingsWrapper
      isLoading={isLoading || isLoadingTeams}
      title={`${getTeamTitle(team)} (${members.length})`}
      addonTopComponent={
        <>
          <Can I={PERMISSION.DELETE} a={teamSubject}>
            <ButtonStyled
              withOfflineCheck
              icon="trash"
              color="white"
              onClick={handleOpenModal(REMOVE_TEAM_MODAL)}
            />
          </Can>
          {!isDomainTeam && (
            <ButtonStyled
              withOfflineCheck
              icon="leave"
              color="white"
              onClick={handleOpenModal(LEAVE_TEAM_MODAL)}
            />
          )}
          <Can I={PERMISSION.ADD} a={teamMemberSubject}>
            <AddMemberButton
              withOfflineCheck
              onClick={handleOpenModal(INVITE_MEMBER_MODAL)}
              icon="plus"
              color="black"
            >
              Add a member
            </AddMemberButton>
          </Can>
        </>
      }
    >
      <Table.Main ref={measuredRef}>
        <DataTable
          columns={columns}
          data={tableData}
          initialState={{
            sortBy: [
              {
                id: 'name',
                desc: false,
              },
            ],
          }}
          tableVisibleDataHeight={tableVisibleDataHeight}
        />
      </Table.Main>
      {modalVisibilities[INVITE_MEMBER_MODAL] && (
        <InviteModal
          user={user}
          teamId={team.id}
          invitedMembers={members}
          onRemoveMember={handleRemoveMember}
          onCancel={handleCloseModal(INVITE_MEMBER_MODAL)}
          onSubmit={handleInvite}
        />
      )}
      {modalVisibilities[REMOVE_TEAM_MODAL] && (
        <ConfirmModal
          isOpened
          description="Are you sure you want to remove team?"
          onClickConfirm={handleRemoveTeam}
          onClickCancel={handleCloseModal(REMOVE_TEAM_MODAL)}
        />
      )}
      {modalVisibilities[LEAVE_TEAM_MODAL] && (
        <ConfirmLeaveTeamModal
          isOpened
          teamTitle={team.title}
          onClickConfirm={handleLeaveTeam}
          onClickCancel={handleCloseModal(LEAVE_TEAM_MODAL)}
        />
      )}
    </SettingsWrapper>
  );
};
