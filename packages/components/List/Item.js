import React from 'react';
import styled from 'styled-components';
import {
  ITEM_CREDENTIALS_TYPE,
  ITEM_ICON_TYPES,
} from '@caesar/common/constants';
import { Icon } from '../Icon';
import { Checkbox } from '../Checkbox';

const Title = styled.div`
  margin-right: auto;
  margin-left: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  cursor: pointer;
  transition: all 0.2s;

    &:hover {
      background: ${({ theme }) => theme.color.white};
      border-top-color: ${({ theme }) => theme.color.gallery};
      border-bottom-color: ${({ theme }) => theme.color.gallery};
    }

  ${({ isMultiItem, isActive, theme }) =>
    isActive &&
    isMultiItem &&
    `
      background: ${theme.color.gallery};
    `}

  ${({ isActive, theme }) =>
    isActive &&
    `
      border-top-color: ${theme.color.gallery};
      border-bottom-color: ${theme.color.gallery};
    `}

  ${Title} {
    font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
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

const Addon = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  color: ${({ theme }) => theme.color.gray};
`;

const AddonText = styled.div`
  margin-left: 4px;
  font-size: ${({ theme }) => theme.font.size.small};
`;

const Favorite = styled(Icon)`
  position: absolute;
  top: 4px;
  right: 4px;
`;

const CloseIcon = styled(Icon)`
  position: absolute;
  top: 4px;
  right: 4px;
`;

const ItemTypeIcon = ({ type }) => {
  const icon = ITEM_ICON_TYPES[type] || ITEM_ICON_TYPES[ITEM_CREDENTIALS_TYPE];

  return <Icon name={icon} width={20} height={20} color="white" />;
};

export const Item = ({
  id,
  data: { name, attachments },
  type,
  invited,
  isMultiItem = false,
  isActive = false,
  isClosable = false,
  favorite,
  style,
  onClickClose = Function.prototype,
  onClickItem = Function.prototype,
  ...props
}) => {
  const shouldShowMembers = !!invited.length;
  const shouldShowAttachments = attachments && attachments.length > 0;
  const shouldShowFavoriteIcon = favorite && !isClosable;

  return (
    <Row
      key={id}
      style={style}
      onClick={onClickItem(id)}
      isActive={isActive}
      isMultiItem={isMultiItem}
      {...props}
    >
      <TypeIconWrapper>
        {isMultiItem ? (
          <CheckboxStyled checked={isActive} onChange={Function.prototype} />
        ) : (
          <ItemTypeIcon type={type} />
        )}
      </TypeIconWrapper>
      <Title>{name}</Title>
      {shouldShowAttachments && (
        <Addon>
          <Icon name="clip" width={16} height={16} />
          <AddonText>{attachments.length}</AddonText>
        </Addon>
      )}
      {shouldShowMembers && (
        <Addon>
          <Icon name="group" width={16} height={16} />
          <AddonText>{invited.length}</AddonText>
        </Addon>
      )}
      {shouldShowFavoriteIcon && (
        <Favorite
          name="favorite-active"
          width={16}
          height={16}
          color="emperor"
        />
      )}
      {isClosable && (
        <CloseIcon name="close" width={16} height={16} onClick={onClickClose} />
      )}
    </Row>
  );
};
