import styled from 'styled-components';
import { Icon } from '../Icon';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.white};
`;

export const SelectedOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 8px 16px;
  cursor: pointer;

  &[disabled] {
    pointer-events: none;
  }
`;

export const ValueText = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  color: ${({ theme }) => theme.color.black};
`;

export const IconCloseStyled = styled(Icon)`
  position: absolute;
  right: 20px;
`;

export const Box = styled.div`
  position: absolute;
  top: ${({ top }) => `${top - 2}px`};
  left: -1px;
  z-index: ${({ theme }) => theme.zIndex.basic};
  width: calc(100% + 2px);
`;

export const OptionsList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

export const Option = styled.div`
  display: flex;
  padding: 8px 16px;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.color.lightGray : theme.color.black};
  background-color: ${({ theme }) => theme.color.white};
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    color: ${({ theme, isDisabled }) =>
      isDisabled ? theme.color.lightGray : theme.color.black};
    background-color: ${({ theme }) => theme.color.snow};
  }
`;

export const ArrowIcon = styled(Icon)`
  margin-left: 8px;
  transform: ${({ isOpened }) => (isOpened ? 'scaleY(-1)' : 'scaleY(1)')};
  transition: transform 0.2s;
`;
