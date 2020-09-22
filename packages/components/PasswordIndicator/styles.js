import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const LineIndicators = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const LineIndicator = styled.div`
  display: flex;
  width: 100%;
  margin-right: 10px;
  border: 1px solid
    ${({ isAcceptable, theme }) =>
      isAcceptable ? theme.color.black : theme.color.lightGray};

  &:last-child {
    margin-right: 0;
  }
`;

export const CircleIndicator = styled.div`
  display: flex;
  width: 20px;
  height: 20px;
  background: #eaeaea;
  border-radius: 50%;

  &.percent-20 {
    background-image: linear-gradient(18deg, #eaeaea 50%, transparent 50%),
      linear-gradient(90deg, #505050 50%, #eaeaea 50%);
  }

  &.percent-40 {
    background-image: linear-gradient(-54deg, #eaeaea 50%, transparent 50%),
      linear-gradient(90deg, #505050 50%, #eaeaea 50%);
  }

  &.percent-60 {
    background-image: linear-gradient(90deg, #505050 50%, transparent 50%),
      linear-gradient(54deg, #505050 50%, #eaeaea 50%);
  }

  &.percent-80 {
    background-image: linear-gradient(90deg, #505050 50%, transparent 50%),
      linear-gradient(-18deg, #505050 50%, #eaeaea 50%);
  }

  &.percent-100 {
    background-image: linear-gradient(90deg, #505050 50%, transparent 50%),
      linear-gradient(-90deg, #505050 50%, #eaeaea 50%);
  }
`;

export const CircleIndicatorOverlay = styled.div`
  width: 16px;
  height: 16px;
  margin: auto;
  background: #eaeaea;
  border-radius: 50%;
`;

export const ScoreName = styled.div`
  margin-left: 8px;
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 600;
`;
