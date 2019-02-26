import styled from 'styled-components';

const TextWithLines = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.lightGray};
  text-transform: uppercase;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:before,
  &:after {
    content: '';
    border-top: ${({ width = 2 }) => `${width}px solid`};
    margin: 0 20px 0 0;
    flex: 1 0 20px;
  }

  &:after {
    margin: 0 0 0 20px;
  }
`;

export default TextWithLines;
