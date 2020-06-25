import styled from 'styled-components';

export const AppVersion = styled.div`
  font-size: ${({ theme }) => theme.font.size.xs};
  line-height: ${({ theme }) => theme.font.lineHeight.xs};
  color: ${({ theme }) => theme.color.gray};
`;
