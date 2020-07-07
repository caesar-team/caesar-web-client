import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  TEAM_TYPE,
  TEAM_TEXT_TYPE,
  LIST_TYPES_ARRAY,
} from '@caesar/common/constants';
import { upperFirst } from '@caesar/common/utils/string';
import { useItemTeamAndListOptions } from '@caesar/common/hooks';
import { userDataSelector } from '@caesar/common/selectors/user';
import { teamsByIdSelector } from '@caesar/common/selectors/entities/team';
import { listsByIdSelector } from '@caesar/common/selectors/entities/list';
import { Dropdown } from '../Dropdown';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';

const FormHeader = styled.div`
  display: flex;
  margin: 8px 0 24px;
`;

const StyledDropdown = styled(Dropdown)`
  width: 200px;
  margin-right: 16px;

  ${Dropdown.Button} {
    display: flex;
    align-items: center;
    height: 100%;
    border: 1px solid ${({ theme }) => theme.color.gallery};
    border-radius: 3px;
  }

  ${Dropdown.OptionsList} {
    max-height: 180px;
    overflow: scroll;
  }

  ${Dropdown.Option} {
    display: flex;
    align-items: center;
    width: 100%;
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
  margin-left: auto;
  transform: ${({ isDropdownOpened }) =>
    isDropdownOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

export const CreateForm = () => {
  const { query } = useRouter();
  const [isTeamDropdownOpened, setTeamDropdownOpened] = useState(false);
  const [isListDropdownOpened, setListDropdownOpened] = useState(false);
  const user = useSelector(userDataSelector);
  const teamsById = useSelector(teamsByIdSelector);
  const listsById = useSelector(listsByIdSelector);
  const {
    checkedTeamId,
    checkedListId,
    setCheckedTeamId,
    setCheckedListId,
    teamOptions,
    listOptions,
  } = useItemTeamAndListOptions({
    teamId: query.teamId,
    listId: query.listId,
  });

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
          <Name>{team.title}</Name>
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
  const getTeamTitle = () => {
    switch (true) {
      case !!checkedTeamId &&
        teamsById[checkedTeamId]?.title.toLowerCase() === TEAM_TYPE.DEFAULT:
        return TEAM_TEXT_TYPE[TEAM_TYPE.DEFAULT];
      case !!checkedTeamId:
        return teamsById[checkedTeamId]?.title;
      case !checkedTeamId:
        return TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL];
      default:
        return '';
    }
  };
  const listTitle = LIST_TYPES_ARRAY.includes(listsById[checkedListId]?.label)
    ? upperFirst(listsById[checkedListId]?.label)
    : listsById[checkedListId]?.label;

  const handleSubmit = () => {
    console.log('handleSubmit');
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormHeader>
        <StyledDropdown
          name="teamId"
          options={teamOptionsRenderer}
          onToggle={() => setTeamDropdownOpened(!isTeamDropdownOpened)}
          onClick={(name, value) => setCheckedTeamId(value)}
        >
          <StyledTeamAvatar
            size={24}
            fontSize="xs"
            avatar={teamAvatar}
            {...user}
          />
          <Name>{getTeamTitle()}</Name>
          <ArrowIcon
            name="arrow-triangle"
            width={16}
            height={16}
            color="middleGray"
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
          <Name>{listTitle}</Name>
          <ArrowIcon
            name="arrow-triangle"
            width={16}
            height={16}
            color="middleGray"
            isDropdownOpened={isListDropdownOpened}
          />
        </StyledDropdown>
      </FormHeader>
    </form>
  );
};
