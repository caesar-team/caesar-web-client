import React from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import { match } from '@caesar/common/utils/match';
import Member from './Member';
import {
  AddControl,
  RemoveControl,
  InviteControl,
  RevokeAccessControl,
} from './components';

const MAX_HEIGHT = 400;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-height: ${({ maxHeight }) => maxHeight}px;
`;

const MemberWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
  }
`;

const ControlWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const ADD_CONTROL_TYPE = 'add';
const REMOVE_CONTROL_TYPE = 'remove';
const REVOKE_CONTROL_TYPE = 'revoke';
const INVITE_CONTROL_TYPE = 'invite';

const MemberList = ({
  members,
  teamId,
  className,
  maxHeight = MAX_HEIGHT,
  controlType,
  renderControl = Function.prototype,
  onClickAdd = Function.prototype,
  onClickRemove = Function.prototype,
  onClickRevokeAccess = Function.prototype,
  onChangeRole = Function.prototype,
}) => {
  const renderControlFn = member =>
    match(
      controlType,
      {
        [ADD_CONTROL_TYPE]: <AddControl onClick={onClickAdd(member)} />,
        [REMOVE_CONTROL_TYPE]: (
          <RemoveControl member={member} onClick={onClickRemove(member)} />
        ),
        [REVOKE_CONTROL_TYPE]: (
          <RevokeAccessControl
            onClickRevoke={() => onClickRevokeAccess(member)}
          />
        ),
        [INVITE_CONTROL_TYPE]: (
          <InviteControl
            teamId={teamId}
            member={member}
            onClickAdd={onClickAdd(member)}
            onClickRemove={onClickRemove(member)}
            onChange={onChangeRole(member)}
          />
        ),
      },
      renderControl(member),
    );

  const clickFn = member =>
    match(controlType, {
      [ADD_CONTROL_TYPE]: onClickAdd(member),
    });

  const renderedMembers = members.map(member => (
    <MemberWrapper key={member.id} onClick={() => clickFn(member)}>
      <Member {...member} />
      <ControlWrapper>{renderControlFn(member)}</ControlWrapper>
    </MemberWrapper>
  ));

  return (
    <Wrapper maxHeight={maxHeight} className={className}>
      <Scrollbars autoHeight autoHeightMax={maxHeight}>
        {renderedMembers}
      </Scrollbars>
    </Wrapper>
  );
};

MemberList.Member = MemberWrapper;

export default MemberList;
