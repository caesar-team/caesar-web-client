import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { ROUTES } from '@caesar/common/constants';
import { Link } from '@caesar/components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  height: calc(100vh - 55px);
  padding-top: 110px;
  padding-left: 60px;
  border-right: 1px solid ${({ theme }) => theme.color.gallery};
`;

const StyledLink = styled(Link)`
  font-size: 18px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 'normal')};
  margin-bottom: 25px;
  text-decoration: none;

  &:last-child {
    margin-bottom: 0;
  }
`;

const LINKS = [
  { link: ROUTES.SETTINGS + ROUTES.TEAM, name: 'Teams' },
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
