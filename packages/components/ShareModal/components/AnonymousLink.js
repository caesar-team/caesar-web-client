import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Toggle } from '../../Toggle';
import { Icon } from '../../Icon';
import { Button } from '../../Button';
import { hideLink } from '../utils';

const spin = keyframes`
  0% {transform:rotate(0deg)}
  100% {transform:rotate(360deg)}
`;

const AnonymousLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.color.alto};
  border-radius: 3px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleLabel = styled.div`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ isActive, theme }) =>
    isActive ? theme.color.black : theme.color.gray};
  margin-left: 16px;
`;

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 8px 16px;
  margin-right: 16px;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 3px;
  border: solid 1px ${({ theme }) => theme.color.gallery};
`;

const LinkText = styled.div`
  width: 300px;
  overflow: hidden;
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.emperor};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UpdateIcon = styled(Icon)`
  cursor: pointer;

  &:hover {
    color: ${({ disabled, theme }) =>
      disabled ? theme.color.emperor : theme.color.black};
  }
`;

const UpdateIconLoading = styled(UpdateIcon)`
  animation-name: ${spin};
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

export const AnonymousLink = ({
  link,
  isLoading,
  onToggle,
  onCopy,
  onUpdate,
}) => {
  const isLinkActive = !!link;
  const linkText = isLinkActive ? hideLink(link) : '';

  const isToggleLoading = !isLinkActive && isLoading;

  const UpdateIconComponent = isLoading ? UpdateIconLoading : UpdateIcon;

  return (
    <AnonymousLinkWrapper>
      <ToggleWrapper>
        <Toggle
          checked={isLinkActive}
          value={isLinkActive}
          isLoading={isToggleLoading}
          onChange={onToggle}
        />
        <ToggleLabel isActive={isLinkActive}>
          Share via an anonymous link:
        </ToggleLabel>
      </ToggleWrapper>
      {isLinkActive && (
        <BottomWrapper>
          <LinkWrapper>
            <LinkText>{linkText}</LinkText>
            <UpdateIconComponent
              name="update"
              width={20}
              height={20}
              color="emperor"
              disabled={isLoading}
              onClick={onUpdate}
            />
          </LinkWrapper>
          <Button icon="copy" disabled={isLoading} onClick={onCopy}>
            Copy
          </Button>
        </BottomWrapper>
      )}
    </AnonymousLinkWrapper>
  );
};
