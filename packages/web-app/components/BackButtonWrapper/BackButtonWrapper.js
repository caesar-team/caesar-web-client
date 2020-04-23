import styled from 'styled-components';

const BackButtonWrapper = styled.div`
  position: absolute;
  top: 120px;
  left: 55px;
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.black};
`;

export default BackButtonWrapper;
