import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  min-width: ${({ size }) => size}px;
  flex: 0 0 ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-size: ${({ fontSize, theme }) => theme.font.size[fontSize]};
  color: ${({ theme }) => theme.color.white};
  white-space: nowrap;
  text-align: center;
  background-color: ${({ theme }) => theme.color.gray};
  border-radius: 50%;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  border-style: none;
`;
