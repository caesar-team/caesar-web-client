import styled from 'styled-components';

const getPseudoStyles = ({ position = 'center', width = 2 }) => {
  if (position === 'left') {
    return `
      &:before {
        content: '';
        flex: 0;
      }

      &:after {
        content: '';
        border-top: ${width}px solid;
        margin: 0 20px 0 20px;
        flex: 1 0 20px;
      }
    `;
  }

  if (position === 'right') {
    return `
      &:before {
        content: '';
        border-top: ${width}px solid;
        margin: 0 20px 0 20px;
        flex: 1 0 20px;
      }
    
      &:after {
        content: '';
        flex: 0;
      }
    `;
  }

  return `
    &:before,
    &:after {
      content: '';
      border-top: ${width}px solid;
      margin: 0 20px 0 0;
      flex: 1 0 20px;
    }
  
    &:after {
      margin: 0 0 0 20px;
    }
  `;
};

const TextWithLines = styled.div`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.color.lightGray};
  text-transform: uppercase;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;

  ${getPseudoStyles}
`;

export default TextWithLines;
