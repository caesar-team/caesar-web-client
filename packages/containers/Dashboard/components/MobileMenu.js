import React, { useState, memo } from 'react';
import styled from 'styled-components';
import { MenuList, Icon } from '@caesar/components';
import { LogoCaesarDomain } from '@caesar/components';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : '40%')};
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 18px;
  background-color: ${({ theme, isOpen }) =>
    isOpen ? theme.color.emperor : theme.color.white};
`;

const Menu = styled.div`
  position: absolute;
  top: auto;
  left: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
  width: 100%;
  height: 100%;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  background-color: ${({ theme }) => theme.color.emperor};
`;

const IconWrapper = styled.div`
  width: 54px;
`;

const MobileMenuComponent = ({
  mode,
  isFullWidth,
  setSearchedText,
  setMode,
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Wrapper isFullWidth={isFullWidth}>
      <Header isOpen={isOpen}>
        <IconWrapper>
          {isOpen ? (
            <Icon
              name="close"
              color="White"
              width={16}
              height={16}
              onClick={() => setOpen(false)}
            />  
          ) : (
            <Icon
              name="burger"
              width={20}
              height={20}
              onClick={() => setOpen(true)}
            />
          )}
        </IconWrapper>
        <LogoCaesarDomain
          href="/"
          color={isOpen ? 'white' : 'black'}
          domainNameColor={isOpen ? 'white' : 'gray'}
        />
      </Header>
      <Menu isOpen={isOpen}>
        <MenuList
          mode={mode}
          setSearchedText={setSearchedText}
          setMode={setMode}
          closeMobileMenu={() => setOpen(false)}
          isDarkMode
        />
      </Menu>
    </Wrapper>
  );
};

export const MobileMenu = memo(MobileMenuComponent);
