import styled from 'styled-components';

export const MenuItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MenuItem = styled.div`
  font-size: 18px;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  text-transform: capitalize;
  color: ${({ theme, isActive }) =>
    isActive ? theme.color.black : theme.color.emperor};
`;
