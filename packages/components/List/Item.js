import React from 'react';
import styled from 'styled-components';
import {
  ITEM_TYPE,
  ITEM_ICON_TYPE,
  PERMISSION_ENTITY,
  PERMISSION,
  PERMISSION_MESSAGES,
} from '@caesar/common/constants';
import { Icon } from '../Icon';
import { Checkbox } from '../Checkbox';
import { Can } from '../Ability';

const Title = styled.div`
  margin-right: auto;
  margin-left: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const CheckboxStyled = styled(Checkbox)`
  ${Checkbox.Box} {
    background-color: ${({ theme }) => theme.color.emperor};
    border: 1px solid ${({ theme }) => theme.color.emperor};

    ${({ checked }) => `
      > svg {
        display: ${checked ? 'block' : 'none'};
      }
    `}
  }

  ${Checkbox.Input}:checked + ${Checkbox.Box} {
    background-color: ${({ theme }) => theme.color.emperor};
    border-color: ${({ theme }) => theme.color.emperor};
  }
`;

const ItemTypeIcon = ({ type }) => {
  const icon = ITEM_ICON_TYPE[type] || ITEM_ICON_TYPE[ITEM_TYPE.CREDENTIALS];

  return <Icon name={icon} width={20} height={20} color="white" />;
};

const IconWrapper = styled.span``;

const Tooltip = styled.div`
  display: none;
  position: absolute;
  top: -40px;
  left: 0;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.color.black};
  color: ${({ theme }) => theme.color.white};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.font.size.xs};
  white-space: nowrap;
  transform: translate(-50%, 0);
  z-index: 1000;
`;

const NotEditIconWrapper = styled.div`
  position: relative;

  &:hover {
    ${Tooltip} {
      display: flex;
    }
  }
`;

const NotEditIcon = styled(Icon)`
`;

const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 23px;
  background: ${({ isActive, theme }) =>
    isActive ? theme.color.white : 'transparent'};
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;

  ${({ hasHover, theme }) => 
    hasHover && 
    `
      cursor: pointer;

      &:hover {
        background: ${theme.color.white};
        border-top-color: ${theme.color.gallery};
        border-bottom-color: ${theme.color.gallery};
        
        ${CheckboxStyled}, ${NotEditIcon} {
          display: flex;
        }

        ${IconWrapper} {
          display: none;
        }
      }
    `}

  ${({ isMultiItem, isActive, isInModal, theme }) => {
    if (isActive && isMultiItem) {
      return `background: ${theme.color.gallery};`; 
    }
  
    if (isInModal) {
      return `background: ${theme.color.snow};`;
    }
  }}

  ${({ isActive, theme }) =>
    isActive &&
    `
      border-top-color: ${theme.color.gallery};
      border-bottom-color: ${theme.color.gallery};
    `}

  ${Title} {
    font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  }
  
  ${CheckboxStyled}, ${NotEditIcon} {
    display: ${({ isMultiItem }) => isMultiItem ? 'flex' : 'none'};
  }
  
  ${IconWrapper} {
    display: ${({ isMultiItem }) => isMultiItem ? 'none' : 'inline-block'};
  }
  
  ${Tooltip} {
    display: none;
  }
`;

const TypeIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 40px;
  height: 40px;
  background: ${({ theme }) => theme.color.gray};
  border-radius: 4px;
`;

const Addon = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  color: ${({ theme }) => theme.color.gray};

  ${({ isInModal }) => isInModal && `
    &:last-of-type {
      margin-right: 60px;
    }
  `};
`;

const AddonText = styled.div`
  margin-left: 4px;
  font-size: ${({ theme }) => theme.font.size.small};
`;

const CloseIcon = styled(Icon)`
  position: absolute;
  top: 0;
  right: 28px;
  bottom: 0;
  margin: auto;
  fill: ${({ theme }) => theme.color.gray};
  cursor: pointer;

  &:hover {
    fill: ${({ theme }) => theme.color.black};
  }
`;

export const Item = ({
  id,
  data: { name, attachments },
  type,
  invited,
  isMultiItem = false,
  isActive = false,
  isClosable = false,
  hasHover = true,
  isInModal = false,
  favorite,
  style,
  teamId,
  _links,
  onClickClose = Function.prototype,
  onClickItem = Function.prototype,
  onSelectItem = Function.prototype,
  ...props
}) => {
  const shouldShowMembers = !!invited.length;
  const shouldShowAttachments = attachments && attachments.length > 0;
  const shouldShowFavoriteIcon = favorite && !isClosable;
  const itemSubject = teamId
    ? {
      __typename: PERMISSION_ENTITY.TEAM_ITEM,
      team_move_item: !!_links?.team_move_item,
      team_batch_share_item: !!_links?.team_batch_share_item,
      team_delete_item: !!_links?.team_delete_item,
    }
    : {
      __typename: PERMISSION_ENTITY.ITEM,
      move_item: !!_links?.move_item,
      batch_share_item: !!_links?.batch_share_item,
      delete_item: !!_links?.delete_item,
    };
  const possiblePermissions = [
    PERMISSION.MOVE,
    PERMISSION.SHARE,
    PERMISSION.TRASH,
  ];

  return (
    <Row
      key={id}
      style={style}
      onClick={onClickItem(id)}
      isActive={isActive}
      isMultiItem={isMultiItem}
      hasHover={hasHover}
      isInModal={isInModal}
      {...props}
    >
      <TypeIconWrapper onClick={e => { e.stopPropagation(); }}>
        <Can I={possiblePermissions} an={itemSubject}>
          <CheckboxStyled
            checked={isActive}
            onChange={() => { onSelectItem(id)}}
          />
          <IconWrapper>
            <ItemTypeIcon type={type} />
          </IconWrapper>
        </Can>
        <Can not I={possiblePermissions} an={itemSubject}>
          <NotEditIconWrapper>
            <NotEditIcon name="not-edit" width={20} height={20} color="white" />
            <Tooltip>{PERMISSION_MESSAGES.FORBIDDEN_SELECT}</Tooltip>
          </NotEditIconWrapper>
          <IconWrapper>
            <ItemTypeIcon type={type} />
          </IconWrapper>
        </Can>
      </TypeIconWrapper>
      <Title>{name}</Title>
      {shouldShowAttachments && (
        <Addon isInModal={isInModal}>
          <Icon name="clip" width={16} height={16} />
          <AddonText>{attachments.length}</AddonText>
        </Addon>
      )}
      {shouldShowMembers && (
        <Addon isInModal={isInModal}>
          <Icon name="members" width={16} height={16} />
          <AddonText>{invited.length}</AddonText>
        </Addon>
      )}
      {shouldShowFavoriteIcon && (
        <Addon>
          <Icon
            name="favorite-active"
            width={16}
            height={16}
            color="emperor"
          />
        </Addon>
      )}
      {isClosable && (
        <CloseIcon name="close" width={10} height={10} onClick={onClickClose} />
      )}
    </Row>
  );
};
