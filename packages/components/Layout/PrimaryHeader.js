import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import equal from 'fast-deep-equal';
import styled from 'styled-components';
import Link from 'next/link';
import { logout } from '@caesar/common/actions/user';
import { ROUTES } from '@caesar/common/constants';
import { Icon } from '../Icon';
import { Dropdown } from '../Dropdown';
import { SearchInput } from '../Input';
import { AddItem } from '../AddItem';
import { Logo } from './Logo';

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

const AddItemButton = styled(AddItem)`
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
  ${Dropdown.Button} {
    display: flex;
    color: ${({ theme }) => theme.color.black};
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: ${({ theme }) => theme.color.emperor};
    }
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

const PrimaryHeaderComponent = ({
  user,
  searchedText,
  onSearch,
  onClickReset,
  workInProgressList,
  onClickCreateItem = Function.prototype,
}) => {
  const dispatch = useDispatch();
  const [isDropdownOpened, setDropdownOpened] = useState(false);
  const userName = (user && (user.name || user.email)) || '';

  const handleToggleDropdown = () => {
    setDropdownOpened(!isDropdownOpened);
  };

  const Options = (
    <>
      <Option key="settings">
        <Link href={ROUTES.SETTINGS + ROUTES.TEAM}>
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
            <AddItemButton
              workInProgressList={workInProgressList}
              onClickCreateItem={onClickCreateItem}
            />
            <UserSection>
              <StyledDropdown
                renderOverlay={() => Options}
                onToggle={handleToggleDropdown}
                withTriangleAtTop
              >
                <UserName>{userName}</UserName>
                <ArrowIcon
                  name="arrow-triangle"
                  width={16}
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
    </>
  );
};

export const PrimaryHeader = memo(
  PrimaryHeaderComponent,
  (prevProps, nextProps) => equal(prevProps, nextProps),
);
