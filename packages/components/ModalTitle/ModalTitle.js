import styled from 'styled-components';

export const ModalTitle = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  text-transform: uppercase;
  margin-bottom: 25px;
`;
