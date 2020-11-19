import styled from 'styled-components';
import { Icon } from '../../Icon';

export const Wrapper = styled.div``;
export const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
`;
export const DownloadIcon = styled(Icon)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;
export const Inner = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-gap: 16px 40px;
`;
export const PlusIcon = styled(Icon)``;
export const AddNewAttach = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  height: 40px;
  border: 1px dashed ${({ theme }) => theme.color.gallery};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: border-color 0.2s;

  ${({ isDragActive, theme }) =>
    isDragActive &&
    `border-color: ${theme.color.black};

    ${PlusIcon} {
      color: ${theme.color.black};
    }
  `}

  &:hover {
    border-color: ${({ theme }) => theme.color.black};

    ${PlusIcon} {
      color: ${({ theme }) => theme.color.black};
    }
  }
`;
