import styled from 'styled-components';

export const ModalSubtitle = styled.div`
  display: flex;
  justify-content: center;
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.gray};
  margin-bottom: 16px;
`;
