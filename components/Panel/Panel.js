import React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  border-left: 1px solid ${({ theme }) => theme.gallery};
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  padding: 0 30px;
  max-height: 70px;
  min-height: 70px;
`;

const SearchSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchText = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.gray};
  margin-left: 20px;
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
`;

const Panel = () => (
  <Wrapper>
    <SearchSection>
      <StyledIcon name="search" width={18} height={18} />
      <SearchText>Search by Caesar… </SearchText>
    </SearchSection>
  </Wrapper>
);

export default Panel;
