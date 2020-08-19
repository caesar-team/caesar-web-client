import React, { useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useItemTeamAndListOptions } from '@caesar/common/hooks';
import { userDataSelector } from '@caesar/common/selectors/user';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { getTeamTitle } from '@caesar/common/utils/team';
import { Dropdown } from '../../Dropdown';
import { Avatar } from '../../Avatar';
import { Icon } from '../../Icon';

const Wrapper = styled.div`
  display: flex;
`;

const StyledDropdown = styled(Dropdown)`
  width: 200px;
  margin-right: 16px;

  ${Dropdown.Button} {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 8px 16px;
    border: 1px solid ${({ theme }) => theme.color.gallery};
    border-radius: 3px;
  }

  ${Dropdown.Box} {
    width: 100%;
  }

  ${Dropdown.OptionsList} {
    max-height: 180px;
    overflow: scroll;
  }

  ${Dropdown.Option} {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 16px;
    overflow: hidden;
  }
`;

const StyledTeamAvatar = styled(Avatar)`
  margin-right: 16px;
`;

const ListIcon = styled(Icon)`
  flex: 0 0 16px;
  margin-right: 16px;
`;

const Name = styled.span`
  display: inline-block;
  overflow: hidden;
  font-size: ${({ theme }) => theme.font.size.main};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ArrowIcon = styled(Icon)`
  flex: 0 0 16px;
  margin-left: auto;
  transform: ${({ isDropdownOpened }) =>
    isDropdownOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

export const FormHeader = ({ teamId, listId, onChangePath, className }) => {
  const [isTeamDropdownOpened, setTeamDropdownOpened] = useState(false);
  const [isListDropdownOpened, setListDropdownOpened] = useState(false);
  const user = useSelector(userDataSelector);
  const teamsById = useSelector(teamsByIdSelector);
  const {
    checkedTeamId,
    checkedTeamTitle,
    checkedListId,
    checkedListLabel,
    setCheckedTeamId,
    setCheckedListId,
    teamOptions,
    listOptions,
  } = useItemTeamAndListOptions({ teamId, listId });

  useUpdateEffect(() => {
    onChangePath(checkedTeamId, checkedListId);
  }, [checkedTeamId, checkedListId, setCheckedTeamId, setCheckedListId]);

  const teamOptionsRenderer = teamOptions
    .filter(team => team.id !== checkedTeamId)
    .map(team => ({
      value: team.id,
      label: (
        <>
          <StyledTeamAvatar
            avatar={team.icon}
            email={team.email}
            size={24}
            fontSize="xs"
          />
          <Name>{getTeamTitle(team)}</Name>
        </>
      ),
    }));

  const listOptionsRenderer = listOptions
    .filter(list => list.id !== checkedListId)
    .map(list => ({
      value: list.id,
      label: <Name>{list.label}</Name>,
    }));

  const teamAvatar = teamsById[checkedTeamId]?.icon;

  return (
    <Wrapper className={className}>
      <StyledDropdown
        name="teamId"
        options={teamOptionsRenderer}
        onToggle={() => setTeamDropdownOpened(!isTeamDropdownOpened)}
        onClick={(name, value) => setCheckedTeamId(value)}
      >
        {checkedTeamId ? (
          <StyledTeamAvatar size={24} fontSize="xs" avatar={teamAvatar} />
        ) : (
          <StyledTeamAvatar size={24} fontSize="xs" {...user} />
        )}
        <Name>{checkedTeamTitle}</Name>
        <ArrowIcon
          name="arrow-triangle"
          width={16}
          height={16}
          color="black"
          isDropdownOpened={isTeamDropdownOpened}
        />
      </StyledDropdown>
      <StyledDropdown
        name="listId"
        options={listOptionsRenderer}
        onToggle={() => setListDropdownOpened(!isListDropdownOpened)}
        onClick={(name, value) => setCheckedListId(value)}
      >
        <ListIcon name="list" width={16} height={16} color="black" />
        <Name>{checkedListLabel}</Name>
        <ArrowIcon
          name="arrow-triangle"
          width={16}
          height={16}
          color="black"
          isDropdownOpened={isListDropdownOpened}
        />
      </StyledDropdown>
    </Wrapper>
  );
};
