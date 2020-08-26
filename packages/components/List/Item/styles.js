import React from 'react';
import styled from 'styled-components';
import {
  ITEM_TYPE,
  ITEM_ICON_TYPE
} from '@caesar/common/constants';
import { Icon } from '../../Icon';
import { Checkbox } from '../../Checkbox';
export const Title = styled.div`
  margin-right: auto;
  margin-left: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
export const CheckboxStyled = styled(Checkbox)`
  ${Checkbox.Box} {
    background-color: ${({ theme }) => theme.color.emperor};
    border: 1px solid ${({ theme }) => theme.color.emperor};
    color: ${({ theme }) => theme.color.gray};

    &:hover {
      > svg {
        display: block;
      }
    }

    ${({ checked }) => `
      > svg {
        display: ${checked ? 'block' : 'none'};
      }
    `}
  }

  ${Checkbox.Input}:checked + ${Checkbox.Box} {
    color: ${({ theme }) => theme.color.white};
    background-color: ${({ theme }) => theme.color.emperor};
    border-color: ${({ theme }) => theme.color.emperor};
  }
`;
export const ItemTypeIcon = ({ type }) => {
  const icon = ITEM_ICON_TYPE[type] || ITEM_ICON_TYPE[ITEM_TYPE.CREDENTIALS];

  return <Icon name={icon} width={20} height={20} color="white" />;
};
export const IconWrapper = styled.span``;
export const Tooltip = styled.div`
  display: none;
  position: absolute;
  top: ${({ isTop }) => (isTop ? 'auto' : '-40px')};
  bottom: ${({ isTop }) => (isTop ? '-40px' : 'auto')};
  left: -10px;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.color.black};
  color: ${({ theme }) => theme.color.white};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.font.size.xs};
  white-space: nowrap;
  z-index: ${({ theme }) => theme.zIndex.basic};
`;
export const NotEditIconWrapper = styled.div`
  position: relative;

  &:hover {
    ${Tooltip} {
      display: flex;
    }
  }
`;
export const NotEditIcon = styled(Icon)``;
export const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 23px;
  background: ${({ isActive, theme }) => isActive ? theme.color.white : 'transparent'};
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;

  ${({ hasHover, theme }) => hasHover &&
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

    return '';
  }}

  ${({ isActive, theme }) => isActive &&
    `
      border-top-color: ${theme.color.gallery};
      border-bottom-color: ${theme.color.gallery};
    `}

  ${Title} {
    font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  }
  
  ${CheckboxStyled}, ${NotEditIcon} {
    display: ${({ isMultiItem }) => (isMultiItem ? 'flex' : 'none')};
  }
  
  ${IconWrapper} {
    display: ${({ isMultiItem }) => (isMultiItem ? 'none' : 'inline-block')};
  }
  
  ${Tooltip} {
    display: none;
  }
`;
export const TypeIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 40px;
  height: 40px;
  background: ${({ isForbiddenMultiItem, theme }) => isForbiddenMultiItem ? theme.color.lightGray : theme.color.gray};
  border-radius: 4px;
`;
export const Addon = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  color: ${({ theme }) => theme.color.gray};

  ${({ isInModal }) => isInModal &&
    `
    &:last-of-type {
      margin-right: 60px;
    }
  `};
`;
export const AddonText = styled.div`
  margin-left: 4px;
  font-size: ${({ theme }) => theme.font.size.small};
`;
export const CloseIcon = styled(Icon)`
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
