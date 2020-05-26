import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import equal from 'fast-deep-equal';
import styled from 'styled-components';
import Link from 'next/link';
import { setCurrentTeamId, logout } from '@caesar/common/actions/user';
import {
  currentTeamSelector,
  userTeamListSelector,
} from '@caesar/common/selectors/user';
import {
  ITEM_TYPES,
  ITEM_ICON_TYPES,
  CREATE_PERMISSION,
  ITEM_ENTITY_TYPE,
} from '@caesar/common/constants';
import { Icon } from '../Icon';
import { Dropdown } from '../Dropdown';
import { SearchInput } from '../Input';
import { Button } from '../Button';
import { TeamModal } from '../TeamModal';
import { Can } from '../Ability';
import { Logo } from './Logo';
import { withOfflineDetection } from '../Offline';

const Wrapper = styled.header`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  height: 56px;
`;

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 287px;
  padding-left: 24px;
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 0 24px;
`;

const AddItemButton = styled(Button)`
  margin-right: 10px;
`;

const UserSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
`;

const UserName = styled.div`
  font-size: 16px;
  margin-left: 15px;
  margin-right: 15px;
`;

const StyledDropdown = styled(Dropdown)`
  display: flex;
  color: ${({ theme }) => theme.color.black};
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.emperor};
  }
`;

const Option = styled.div`
  padding: 10px 30px;
  font-size: 16px;
  color: ${({ theme }) => theme.color.black};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
  }
`;

const Anchor = styled.a`
  color: inherit;
  white-space: nowrap;
  text-decoration: none;
`;

const ArrowIcon = styled(Icon)`
  transform: ${({ isDropdownOpened }) =>
    isDropdownOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

const PlusIcon = styled(Icon)`
  margin-right: 15px;
`;

const AddItemOption = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 16px;
  padding: 10px 30px;
  border: none;
  background: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
  }
`;

const { ITEM_CREDENTIALS_TYPE, ITEM_DOCUMENT_TYPE } = ITEM_TYPES;

const itemTypesOptions = [
  { label: 'Password', value: ITEM_CREDENTIALS_TYPE },
  { label: 'Secure note', value: ITEM_DOCUMENT_TYPE },
];

const renderAddItemOptions = (value, label) => (
  <AddItemOption key={value}>
    <PlusIcon name={ITEM_ICON_TYPES[value]} width={16} height={16} />
    {label}
  </AddItemOption>
);

const PrimaryHeaderComponent = ({
  user,
  searchedText,
  isOnline,
  onSearch,
  onClickReset,
  workInProgressList,
  onClickCreateItem = Function.prototype,
}) => {
  const dispatch = useDispatch();
  const teamList = useSelector(userTeamListSelector);
  const team = useSelector(currentTeamSelector);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const userName = (user && (user.name || user.email)) || '';
  const shouldShowSwitchTeamOption = teamList && teamList.length > 0;

  const handleToggleDropdown = () => {
    setIsDropdownOpened(!isDropdownOpened);
  };

  const handleShowTeamModal = () => {
    setIsDropdownOpened(false);
    setIsModalOpened(true);
  };

  const handleCloseModal = () => {
    setIsModalOpened(false);
  };

  const handleChangeTeamId = teamId => {
    if (!team || team.id !== teamId) {
      dispatch(setCurrentTeamId(teamId));
    }

    handleCloseModal();
  };

  const itemSubject = {
    __type: ITEM_ENTITY_TYPE,
    listType: workInProgressList.type,
    teamId: workInProgressList.teamId,
    userRole: workInProgressList.userRole,
  };

  const Options = (
    <>
      {/* TODO: Replace Switch Team in secondary header */}
      {shouldShowSwitchTeamOption && (
        <Option key="teams" onClick={handleShowTeamModal}>
          <Anchor>Switch Team</Anchor>
        </Option>
      )}
      <Option key="settings">
        <Link href="/settings/manage">
          <Anchor>Settings</Anchor>
        </Link>
      </Option>
      <Option key="logout" onClick={() => dispatch(logout())}>
        <Anchor>Logout</Anchor>
      </Option>
    </>
  );

  return (
    <>
      <Wrapper>
        <LeftWrapper>
          <Logo href="/" />
        </LeftWrapper>
        {!!user && (
          <RightWrapper>
            <SearchInput
              searchedText={searchedText}
              onChange={onSearch}
              onClickReset={onClickReset}
            />
            <Can I={CREATE_PERMISSION} of={itemSubject}>
              <Dropdown
                options={itemTypesOptions}
                onClick={onClickCreateItem}
                optionRender={renderAddItemOptions}
                withTriangleAtTop
                ButtonElement={({ handleToggle }) => (
                  <AddItemButton
                    withOfflineCheck
                    isOnline={isOnline}
                    icon="plus"
                    onClick={handleToggle}
                  >
                    Add item
                  </AddItemButton>
                )}
              />
            </Can>
            <UserSection>
              <StyledDropdown
                renderOverlay={() => Options}
                onToggle={handleToggleDropdown}
                withTriangleAtTop
              >
                <UserName>{userName}</UserName>
                <ArrowIcon
                  name="arrow-triangle"
                  width={10}
                  height={16}
                  color="middleGray"
                  isDropdownOpened={isDropdownOpened}
                />
              </StyledDropdown>
            </UserSection>
            {/* TODO: Add notifications */}
          </RightWrapper>
        )}
      </Wrapper>
      {isModalOpened && (
        <TeamModal
          teamList={teamList}
          teamId={team ? team.id : null}
          onChangeTeam={handleChangeTeamId}
          onCancel={handleCloseModal}
        />
      )}
    </>
  );
};

export const PrimaryHeader = withOfflineDetection(
  memo(PrimaryHeaderComponent, (prevProps, nextProps) =>
    equal(prevProps, nextProps),
  ),
);
