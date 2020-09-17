import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.alto};
  width: 100%;
  padding: 40px;
`;

const Title = styled.div`
  font-size: 36px;
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 30px;
`;

export const Users = () => (
  <Wrapper>
    <Title>Users</Title>
    <div>Users list</div>
  </Wrapper>
);
