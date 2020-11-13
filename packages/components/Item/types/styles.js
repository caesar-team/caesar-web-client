import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  padding: 0 4px;
`;

export const DummyRect = styled.div`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  height: ${({ height }) => height}px;
  background: ${({ theme }) => theme.color.lighterGray};
  border-radius: 2px;
  filter: blur(2px);
`;

export const Title = styled(DummyRect)`
  margin-bottom: 12px;
`;

export const Avatar = styled(DummyRect)`
  border-radius: 50%;
`;

export const OwnerWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 0;
  margin-right: auto;
`;

export const Owner = styled.div`
  margin-left: 16px;
`;

export const OwnerName = styled(DummyRect)`
  margin-bottom: 8px;
`;

export const Attachments = styled(DummyRect)`
  margin: 16px 0;
`;

export const Loader = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.font.size.small};
  font-weight: 600;

  svg {
    margin-bottom: 12px;
  }
`;

export const DummyCred = styled.div`
  margin-bottom: 24px;
`;

export const DummyCredTitle = styled(DummyRect)`
  margin-bottom: 8px;
`; 

export const DummyCredContent = styled(DummyRect)`
  margin-bottom: 12px;
`; 
