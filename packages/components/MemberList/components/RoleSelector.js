import React from 'react';
import styled from 'styled-components';
import { TEAM_ROLES } from '@caesar/common/constants';
import { Select } from '@caesar/components/Select';

const StyledSelect = styled(Select)`
  width: 170px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  margin-left: auto;
`;

const OPTIONS = Object.values(TEAM_ROLES).map(role => ({
  value: role,
  label: role,
}));

export const RoleSelector = ({
  className,
  member,
  onChange,
}) => (
  <StyledSelect
    name="role"
    value={member.role}
    options={OPTIONS}
    className={className}
    onChange={onChange}
  />
);
