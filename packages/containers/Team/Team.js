/* eslint-disable camelcase */
import React, { useState, useCallback, useMemo, memo } from 'react';
import { useUpdateEffect } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { isLoadingSelector } from '@caesar/common/selectors/workflow';
import { isLoadingTeamsSelector } from '@caesar/common/selectors/entities/team';
import {
  removeTeamRequest,
  editTeamRequest,
} from '@caesar/common/actions/entities/team';
import { leaveTeamRequest } from '@caesar/common/actions/currentUser';
import {
  addTeamMembersBatchRequest,
  grantAccessTeamMemberRequest,
  removeTeamMemberRequest,
  updateTeamMemberRoleRequest,
} from '@caesar/common/actions/entities/member';
import {
  Button,
  SettingsWrapper,
  Can,
  DataTable,
  TableStyles as Table,
  InviteModal,
  ConfirmModal,
  ConfirmLeaveTeamModal,
  ConfirmRemoveMemberModal,
  TeamModal,
  Hint,  
} from '@caesar/components';
import {
  PERMISSION,
  PERMISSION_ENTITY,
  ROUTES,
  TEAM_ROLES,
  TEAM_TYPE,
} from '@caesar/common/constants';
import { getTeamTitle } from '@caesar/common/utils/team';
import { ability } from '@caesar/common/ability';
import { MODAL } from './constants';
import { createColumns } from './createColumns';

const ButtonStyled = styled(Button)`
  margin-right: 24px;
`;

const AddMemberButton = styled(ButtonStyled)`
  margin-right: 0;
`;

export const TeamContainerComponent = ({ currentUser, team, members }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [modalVisibilities, setModalVisibilities] = useState({
    [MODAL.INVITE_MEMBER]: false,
    [MODAL.REMOVE_MEMBER]: false,
    [MODAL.LEAVE_TEAM]: false,
    [MODAL.REMOVE_TEAM]: false,
    [MODAL.NEW_TEAM]: false,
  });
  const [manipulatedMember, setManipulatedMember] = useState(null);

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

  const isTeamLocked = team.locked;
  const canEditTeam = ability.can(PERMISSION.EDIT, team._permissions);
  const tableData = useMemo(() => members, [members]);

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

  const handleChangeRole = memberId => (_, value) => {
    dispatch(updateTeamMemberRoleRequest(memberId, value));
  };

  const handleGrantAccessMember = memberId => () => {
    dispatch(grantAccessTeamMemberRequest(memberId));
  };

  const handleOpenRemoveMemberModal = member => () => {
    setManipulatedMember(member);
    handleOpenModal(MODAL.REMOVE_MEMBER)();
  };

  const handleCloseRemoveMemberModal = () => {
    handleCloseModal(MODAL.REMOVE_MEMBER)();
    setManipulatedMember(null);
  };

  const handleRemoveMember = () => {
    dispatch(
      removeTeamMemberRequest({
        memberId: manipulatedMember.id,
        handleCloseRemoveMemberModal,
      }),
    );
  };

  const columns = useMemo(
    () =>
      createColumns({
        tableWidth,
        tableHeight,
        tableScrollTop,
        canGrantAccessMember: !isTeamLocked && canEditTeam,
        handleChangeRole,
        handleOpenRemoveMemberModal,
        handleGrantAccessMember,
      }),
    [tableWidth, tableHeight, tableScrollTop, isTeamLocked],
  );

  const handleInvite = invitedUsers => {
    dispatch(addTeamMembersBatchRequest(team.id, invitedUsers));
    handleCloseModal(MODAL.INVITE_MEMBER)();
  };

  const handleLeaveTeam = () => {
    dispatch(leaveTeamRequest(team.id));
  };

  const handleRemoveTeam = () => {
    dispatch(removeTeamRequest(team.id));
  };

  const handleEditTeam = ({
    teamId,
    title,
    icon,
    setSubmitting,
    setErrors,
  }) => {
    dispatch(
      editTeamRequest({
        teamId,
        title,
        icon,
        handleCloseModal: handleCloseModal(MODAL.NEW_TEAM),
        setSubmitting,
        setErrors,
      }),
    );
  };

  if (!team.id && !isLoadingTeams) {
    router.push(ROUTES.SETTINGS + ROUTES.TEAM);

    return null;
  }

  const teamSubject = {
    __typename: PERMISSION_ENTITY.TEAM,
    ...team._permissions,
  };

  const teamMemberSubject = {
    __typename: PERMISSION_ENTITY.TEAM_MEMBER,
    team_member_add:
      team._permissions?.team_member_add ||
      team.teamRole === TEAM_ROLES.ROLE_ADMIN ||
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
          <Can I={PERMISSION.EDIT} a={teamSubject}>
            <Hint text="Edit the team">
              <ButtonStyled
                withOfflineCheck
                icon="pencil"
                color="white"
                onClick={handleOpenModal(MODAL.NEW_TEAM)}
              />
            </Hint>
          </Can>
          <Can I={PERMISSION.DELETE} a={teamSubject}>
            <Hint text="Remove the team">
              <ButtonStyled
                withOfflineCheck
                icon="trash"
                color="white"
                onClick={handleOpenModal(MODAL.REMOVE_TEAM)}
              />
            </Hint>
          </Can>
          <Can I={PERMISSION.LEAVE} a={teamSubject}>
            {!isDomainTeam && (
              <Hint text="Leave">
                <ButtonStyled
                  withOfflineCheck
                  icon="leave"
                  color="white"
                  onClick={handleOpenModal(MODAL.LEAVE_TEAM)}
                />
              </Hint>
            )}
          </Can>
          {!isTeamLocked && (
            <Can I={PERMISSION.ADD} a={teamMemberSubject}>
              <AddMemberButton
                withOfflineCheck
                onClick={handleOpenModal(MODAL.INVITE_MEMBER)}
                icon="plus"
                color="black"
              >
                Add a member
              </AddMemberButton>
            </Can>
          )}
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
      {modalVisibilities[MODAL.NEW_TEAM] && (
        <TeamModal
          teamId={team.id}
          onEditSubmit={handleEditTeam}
          onCancel={handleCloseModal(MODAL.NEW_TEAM)}
        />
      )}
      {modalVisibilities[MODAL.INVITE_MEMBER] && (
        <InviteModal
          currentUser={currentUser}
          teamId={team.id}
          members={members}
          onRemoveMember={handleRemoveMember}
          onCancel={handleCloseModal(MODAL.INVITE_MEMBER)}
          onSubmit={handleInvite}
        />
      )}
      {modalVisibilities[MODAL.REMOVE_TEAM] && (
        <ConfirmModal
          isOpened
          description="Are you sure you want to remove team?"
          onClickConfirm={handleRemoveTeam}
          onClickCancel={handleCloseModal(MODAL.REMOVE_TEAM)}
        />
      )}
      {modalVisibilities[MODAL.LEAVE_TEAM] && (
        <ConfirmLeaveTeamModal
          isOpened
          teamTitle={team.title}
          onClickConfirm={handleLeaveTeam}
          onClickCancel={handleCloseModal(MODAL.LEAVE_TEAM)}
        />
      )}
      {modalVisibilities[MODAL.REMOVE_MEMBER] && (
        <ConfirmRemoveMemberModal
          isOpened
          memberName={manipulatedMember.name || manipulatedMember.email}
          onClickConfirm={handleRemoveMember}
          onClickCancel={handleCloseRemoveMemberModal}
        />
      )}
    </SettingsWrapper>
  );
};

export const TeamContainer = memo(TeamContainerComponent);
