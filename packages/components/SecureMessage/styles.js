import { media } from '@caesar/assets/styles/media';
import styled from 'styled-components';
import { Button } from '../Button';
import { ContentEditableComponent } from '../Common/ContentEditable';

export const Text = styled.div`
  margin-bottom: 16px;
  font-size: ${({ theme }) => theme.font.size.main};
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
`;

export const Link = styled.div`
  position: relative;
  padding: 16px;
  margin-bottom: 24px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: 4px;
  word-break: break-all;
  white-space: pre-wrap;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media.wideMobile`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
  `}

  ${media.mobile`
    grid-template-columns: 1fr;
  `}
`;

export const ActionButton = styled(Button)`
  margin-right: 24px;

  ${media.wideMobile`
    margin-right: 0;
  `}
`;

export const CreateNewButton = styled(Button)`
  grid-area: 2 / 1 / 3 / 3;
  margin-left: auto;
  font-weight: 600;

  ${media.wideMobile`
    margin-left: 0;
  `}

  ${media.mobile`
    grid-area: auto;
  `}
`;

export const Row = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }

  ${media.desktop`
    margin-bottom: 16px;
  `}

  ${media.mobile`
    margin-bottom: 16px;
  `}
`;

export const ContentEditableStyled = styled(ContentEditableComponent)`
  font-size: ${({ theme }) =>
    media.mobile ? theme.font.size.small : theme.font.size.main};
  text-align: justify;
`;
