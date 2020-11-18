import React from 'react';
import styled from 'styled-components';
import { TEAM_ROLES } from '@caesar/common/constants';
import { Icon } from '../../Icon';
import { Select } from '../../Select';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const AddButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.black};
  border-radius: 50%;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SelectStyled = styled(Select)`
  width: 200px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  margin-right: 20px;
`;

const RoleSelector = styled(Select)`
  width: 200px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  margin-right: 20px;
`;

const OPTIONS = Object.values(TEAM_ROLES).map(role => ({
  value: role,
  label: role,
}));

const InviteControl = ({
  className,
  member,
  isNewMember = false,
  teamId,
  onClickAdd,
  onClickRemove,
  onChange,
}) => {
  if (isNewMember) {
    return (
      <RoleSelector
        name="role"
        value={member.role}
        options={OPTIONS}
        className={className}
        onChange={onChange}
      />
    );    
  }
  
  return member.teamIds && member.teamIds.includes(teamId) ? (
    <Wrapper>
      <SelectStyled
        name="role"
        value={member.role}
        options={OPTIONS}
        className={className}
        onChange={onChange}
      />
      <Icon
        name="close"
        color="black"
        width={14}
        height={14}
        onClick={onClickRemove}
      />
    </Wrapper>
  ) : (
    <AddButton className={className} onClick={onClickAdd}>
      <Icon name="plus" color="black" width={14} height={14} />
    </AddButton>
  );
};

export default InviteControl;
