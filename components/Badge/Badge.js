import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1.1;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.gray};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.gallery};
  min-width: 30px;
  padding: 2px 6px 1px;
`;

const Badge = ({ count, ...props }) => <Wrapper {...props}>{count}</Wrapper>;

export default Badge;
