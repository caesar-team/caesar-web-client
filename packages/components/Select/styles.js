import styled from 'styled-components';
import { Icon } from '../Icon';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: ${({ theme }) => theme.color.white};
`;

export const SelectedOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
  padding: 8px 16px;
  cursor: pointer;

  &[disabled] {
    pointer-events: none;
  }
`;

export const ValueText = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.black};
  position: relative;
  width: 100%;
`;

export const IconCloseStyled = styled(Icon)`
  position: absolute;
  right: 20px;
`;

export const Box = styled.div`
  position: absolute;
  top: ${({ top }) => `${top}px`};
  z-index: ${({ theme }) => theme.zIndex.basic};
  width: 100%;
`;

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 100%;
`;

export const Option = styled.div`
  display: flex;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.color.lightGray : theme.color.black};
  background-color: ${({ theme }) => theme.color.white};
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
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
