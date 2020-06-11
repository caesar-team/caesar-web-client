import styled from 'styled-components';

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

  &:hover {
    background-color: ${({ withChildren, isEdit, theme }) =>
      !withChildren && !isEdit && theme.color.snow};
    border-top-color: ${({ withChildren, isEdit, theme }) =>
      !withChildren && !isEdit && theme.color.gallery};
    border-bottom-color: ${({ withChildren, isEdit, theme }) =>
      !withChildren && !isEdit && theme.color.gallery};
  }

  ${({ isActive, theme }) =>
    isActive &&
    `
    border-top-color: ${theme.color.gallery};
    border-bottom-color: ${theme.color.gallery};
  `}
`;
