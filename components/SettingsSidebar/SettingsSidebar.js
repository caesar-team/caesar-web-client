import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';
import { Link } from 'components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  height: calc(100vh - 70px);
  padding-top: 110px;
  padding-left: 60px;
  border-right: 1px solid ${({ theme }) => theme.gallery};
`;

const StyledLink = styled(Link)`
  font-size: 18px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 'normal')};
  letter-spacing: 0.6px;
  margin-bottom: 25px;
  text-decoration: none;

  &:last-child {
    margin-bottom: 0;
  }
`;

const LINKS = [
  { link: '/settings/manage', name: 'Manage List' },
  { link: '/settings/import', name: 'Import' },
  { link: '/logout', name: 'Logout' },
];

const SettingsSidebar = ({ router: { route } }) => {
  const renderedLinks = LINKS.map(({ link, name }, index) => {
    const isActive = route === link;

    return (
      <StyledLink to={link} isActive={isActive} key={index}>
        {name}
      </StyledLink>
    );
  });

  return <Wrapper>{renderedLinks}</Wrapper>;
};

export default withRouter(SettingsSidebar);
