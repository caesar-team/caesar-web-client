import React from 'react';
import styled from 'styled-components';
import { ITEM_TYPE, ITEM_ICON_TYPE } from '@caesar/common/constants';
import { Icon } from '../../Icon';
import { Checkbox } from '../../Checkbox';
import { HintStyles } from '../../Hint';

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

export const WebsiteFavIcon = styled.img`
  width: 16px;
  height 16px;
  background-size: 16px;
  background: url("https://www.google.com/s2/favicons?domain=${({ website }) =>
    website}") center no-repeat;
`;

export const ItemTypeIcon = ({ type }) => {
  const icon = ITEM_ICON_TYPE[type] || ITEM_ICON_TYPE[ITEM_TYPE.CREDENTIALS];

  return <Icon name={icon} width={20} height={20} color="white" />;
};

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Tooltip = styled.div`
  ${HintStyles};
  position: absolute;
  top: ${({ showUnder }) => (showUnder ? '-40px' : 'auto')};
  bottom: ${({ showUnder }) => (showUnder ? 'auto' : '-40px')};
  left: -10px;
`;

export const NotEditIconWrapper = styled.div`
  position: relative;

  &:hover {
    ${Tooltip} {
      z-index: ${({ theme }) => theme.zIndex.basic};
      opacity: 1;
    }
  }
`;

export const NotEditIcon = styled(Icon)``;

export const Row = styled.div`
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

  ${({ isMultiItem, isActive, isChecked, isInModal, theme }) => {
    if ((isActive || isChecked) && isMultiItem) {
      return `background: ${theme.color.gallery};`;
    }

    if (isInModal) {
      return `background: ${theme.color.snow};`;
    }

    return '';
  }}

  ${({ isActive, isChecked, theme }) =>
    (isActive || isChecked) &&
    `
      border-top-color: ${theme.color.gallery};
      border-bottom-color: ${theme.color.gallery};
    `}

  ${Title} {
    font-weight: ${({ isActive, isChecked }) =>
      isActive || isChecked ? 600 : 400};
  }
  
  ${CheckboxStyled}, ${NotEditIcon} {
    display: ${({ isMultiItem }) => (isMultiItem ? 'flex' : 'none')};
  }
  
  ${IconWrapper} {
    display: ${({ isMultiItem }) => (isMultiItem ? 'none' : 'flex')};
  }
  
  ${Tooltip} {
    z-index: ${({ theme }) => theme.zIndex.hidden};
    opacity: 0;
  }
`;

export const TypeIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 40px;
  height: 40px;
  background: ${({ isForbiddenMultiItem, theme }) =>
    isForbiddenMultiItem ? theme.color.lightGray : theme.color.gray};
  border-radius: 4px;
`;

export const Addon = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  color: ${({ theme }) => theme.color.gray};

  ${({ isInModal }) =>
    isInModal &&
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
