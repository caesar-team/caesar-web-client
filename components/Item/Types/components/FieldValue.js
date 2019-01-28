import styled from 'styled-components';

export const FieldValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  width: 100%;
  padding: 0 15px;
  margin-top: 12px;
`;
