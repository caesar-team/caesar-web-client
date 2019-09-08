import React from 'react';
import styled from 'styled-components';
import { COMMANDS_ROLES } from 'common/constants';
import { Icon } from '../../Icon';
import { Select } from '../../Select';

const AddButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.black};
  border-radius: 50%;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const IconStyled = styled(Icon)`
  width: 14px;
  height: 14px;
  fill: ${({ theme }) => theme.black};
`;

const SelectStyled = styled(Select)`
  width: 200px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.gallery};
`;

const OPTIONS = Object.values(COMMANDS_ROLES).map(role => ({
  value: role,
  label: role,
}));

const InviteControl = ({ className, member, teamId, onClick, onChange }) =>
  member.teamIds && member.teamIds.includes(teamId) ? (
    <SelectStyled
      name="role"
      value={member.role}
      options={OPTIONS}
      className={className}
      onChange={onChange}
    />
  ) : (
    <AddButton className={className} onClick={onClick}>
      <IconStyled name="plus" />
    </AddButton>
  );

export default InviteControl;
