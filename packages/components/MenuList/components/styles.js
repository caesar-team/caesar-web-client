import styled from 'styled-components';
import { Tooltip } from '../../List/Item/styles';
import { Icon } from '../../Icon';

export const MenuItemInner = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 7px 24px;
  font-weight: ${({ fontWeight, isActive }) =>
    isActive ? 600 : fontWeight || 400};
  color: ${({ isActive, theme }) =>
    isActive ? theme.color.black : theme.color.emperor};
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.color.snow : theme.color.white};
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;

  ${({ isActive, theme }) =>
    isActive &&
    `
    border-top-color: ${theme.color.gallery};
    border-bottom-color: ${theme.color.gallery};
  `}
`;

export const MenuItem = styled.div``;

export const MenuItemTitle = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding-left: 16px;
  margin-right: auto;
`;

export const MenuItemCounter = styled.span`
  margin-left: auto;
`;

export const ListAddIcon = styled(Icon)`
  margin-right: 16px;
  transform: ${({ isListsOpened }) =>
    isListsOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const StyledMenuItemInner = styled(MenuItemInner)`
  &:hover {
    background-color: ${({ withNested, isEdit, theme }) =>
      !withNested && !isEdit && theme.color.snow};
    border-top-color: ${({ withNested, isEdit, theme }) =>
      !withNested && !isEdit && theme.color.gallery};
    border-bottom-color: ${({ withNested, isEdit, theme }) =>
      !withNested && !isEdit && theme.color.gallery};

    ${ListAddIcon} {
      opacity: 1;
    }
  }
`;

export const ListToggleIcon = styled(Icon)`
  transform: ${({ isListsOpened }) =>
    isListsOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

export const Title = styled.div`
  margin-right: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Counter = styled.div``;

export const StyledIcon = styled(Icon)`
  flex: 0 0 16px;
  margin-left: 16px;
  transition: color 0.2s, opacity 0.2s;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const ActionIcon = styled(StyledIcon)`
  display: none;
`;

export const DnDIcon = styled(ActionIcon)`
  position: absolute;
  top: 50%;
  left: 24px;
  margin-left: 0;
  transform: translateY(-50%);
  cursor: grab;
`;

export const Wrapper = styled(MenuItemInner)`
  position: relative;
  padding: ${({ isEdit }) => (isEdit ? '0 24px 0 40px' : '7px 24px 7px 56px')};
  color: ${({ isActive, theme }) =>
    isActive ? theme.color.black : theme.color.gray};

  &:hover {
    color: ${({ theme }) => theme.color.black};

    ${Counter} {
      ${({ isDefault }) => !isDefault && `display: none;`}
    }
    ${ActionIcon} {
      display: block;
    }
    ${DnDIcon} {
      display: ${({ isEdit }) => (isEdit ? 'none' : 'block')};
    }
  }
`;

export const StyledTooltip = styled(Tooltip)`
  display: flex;
  top: -20px;
  left: auto;
  bottom: auto;
  z-index: ${({ theme }) => theme.zIndex.basic};
  opacity: 1;
`;
