import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.red};
`;

export const TexError = ({ text }) => <Wrapper>{text}</Wrapper>;
