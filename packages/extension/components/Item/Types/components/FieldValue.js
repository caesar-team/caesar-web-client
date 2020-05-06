import styled from 'styled-components';

export const FieldValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  letter-spacing: 0.4px;
  border-radius: 3px;
  color: ${({ theme }) => theme.black};
  border: 1px solid ${({ theme }) => theme.gallery};
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.emperor};
    color: ${({ theme }) => theme.white};

    > svg,
    > * > svg {
      fill: ${({ theme }) => theme.white};
    }
  }
`;
