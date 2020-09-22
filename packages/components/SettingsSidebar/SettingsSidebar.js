import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { ROUTES } from '@caesar/common/constants';
import { Link } from '@caesar/components';

const Wrapper = styled.div`
  min-width: 287px;
  height: calc(100vh - 55px);
  padding: 40px 0;
  border-right: 1px solid ${({ theme }) => theme.color.gallery};
`;

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
  padding: 8px 24px;
  color: ${({ isActive, theme }) =>
    isActive ? theme.color.black : theme.color.emperor};
  font-weight: ${({ isActive }) => (isActive ? 600 : 'normal')};
  text-decoration: none;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.color.snow : 'transparent'};
  border: 1px solid
    ${({ isActive, theme }) => (isActive ? theme.color.gallery : 'transparent')};
  border-right: none;
  border-left: none;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const LINKS = [
  { link: ROUTES.SETTINGS + ROUTES.TEAM, name: 'Teams' },
  { link: ROUTES.SETTINGS + ROUTES.USERS, name: 'All users' },
  { link: ROUTES.SETTINGS + ROUTES.IMPORT, name: 'Import' },
];

const SettingsSidebar = ({ router: { route } }) => {
  const renderedLinks = LINKS.map(({ link, name }, index) => {
    const isActive = route.startsWith(link);

    return (
      <StyledLink to={link} isActive={isActive} key={index}>
        {name}
      </StyledLink>
    );
  });

  return <Wrapper>{renderedLinks}</Wrapper>;
};

export default withRouter(SettingsSidebar);
