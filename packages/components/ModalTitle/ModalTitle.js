import styled from 'styled-components';

export const ModalTitle = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.color.black};
  text-transform: uppercase;
  margin-bottom: 25px;
`;
