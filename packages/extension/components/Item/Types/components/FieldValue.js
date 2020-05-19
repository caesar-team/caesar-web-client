import styled from 'styled-components';

export const FieldValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  letter-spacing: 0.4px;
  border-radius: 3px;
  color: ${({ theme }) => theme.color.black};
  border: 1px solid ${({ theme }) => theme.color.gallery};
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.color.emperor};
    color: ${({ theme }) => theme.color.white};

    > svg,
    > * > svg {
      fill: ${({ theme }) => theme.color.white};
    }
  }
`;
