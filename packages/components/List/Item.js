import React from 'react';
import styled from 'styled-components';
import { ITEM_TYPE, ITEM_ICON_TYPE } from '@caesar/common/constants';
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
  transition: all 0.2s;

  ${({ hasHover, theme }) => 
    hasHover && 
    `
      cursor: pointer;

      &:hover {
        background: ${theme.color.white};
        border-top-color: ${theme.color.gallery};
        border-bottom-color: ${theme.color.gallery};
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

const ItemTypeIcon = ({ type }) => {
  const icon = ITEM_ICON_TYPE[type] || ITEM_ICON_TYPE[ITEM_TYPE.CREDENTIALS];

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
  hasHover = true,
  isInModal = false,
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
      hasHover={hasHover}
      isInModal={isInModal}
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
