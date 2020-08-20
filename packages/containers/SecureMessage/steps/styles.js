import styled from 'styled-components';
import { File, ContentEditable } from '@caesar/components';

export const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 620px;
  padding: 22px 24px 24px;
  background: ${({ theme }) => theme.color.darkGray};
`;

export const Message = styled(ContentEditable)`
  width: 100%;
  height: 100%;
  max-height: 183px;
  font-size: inherit;
  color: ${({ theme }) => theme.color.white};
  background: transparent;
  user-select: text;
  white-space: pre-wrap;
  ${({ withAttach }) => withAttach && 'margin-bottom: 20px;'};
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.color.emperor};
`;

export const Attachments = styled.div`
  ${({ withText }) => withText && 'margin-top: 24px;'}
`;

export const FileStyled = styled(File)`
  ${File.FileName} {
    color: ${({ theme }) => theme.color.white};
  }

  &:hover {
    ${File.FileName} {
      color: ${({ theme }) => theme.color.black};
    }
  }

  ${File.FileExt} {
    margin-bottom: 0;

    &:before {
      border-color: ${({ theme }) =>
        `${theme.color.darkGray} ${theme.color.darkGray} transparent transparent`};
    }
  }

  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;
