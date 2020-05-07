import styled from 'styled-components';

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  margin-bottom: 24px;
  padding-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;
